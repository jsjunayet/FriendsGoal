"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const withdrawal_model_1 = require("./withdrawal.model");
const member_model_1 = require("../Member/member.model");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
const notification_service_1 = require("../Notification/notification.service");
/**
 * 1. Create a Withdrawal Request & Hold/Deduct from Profit Balance
 */
const createWithdrawalRequestInDB = async (payload) => {
    const { memberId, amount, method, accountDetails, reason } = payload;
    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Withdrawal amount must be a positive number");
    }
    const member = await member_model_1.Member.findById(memberId);
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member record not found");
    }
    const rawDeposit = member.totalDeposit;
    const availableDeposit = rawDeposit != null ? parseFloat(rawDeposit.toString()) : 0.0;
    const rawPending = member.pendingWithdrawal;
    const pendingWithdrawal = rawPending != null ? parseFloat(rawPending.toString()) : 0.0;
    const maxAllowable = Math.max(0, availableDeposit - pendingWithdrawal);
    if (withdrawAmount > availableDeposit || withdrawAmount > maxAllowable) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You can only request withdrawal from your total deposit amount (৳ ${availableDeposit.toLocaleString()}). Profit balance cannot be withdrawn.`);
    }
    const depositDeduction = withdrawAmount;
    const profitDeduction = 0;
    const referenceId = (0, withdrawal_model_1.generateWithdrawalReferenceId)();
    const docData = {
        referenceId,
        memberId: member._id,
        memberName: member.fullName,
        memberCode: member.memberCode,
        amount: withdrawAmount,
        status: "Pending",
        method: method || "Mobile Banking",
        accountDetails: accountDetails || "",
        reason: reason || "Personal expenses",
        submittedAt: new Date(),
    };
    // Attempt Transaction with Session
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        const withdrawalDoc = new withdrawal_model_1.Withdrawal(docData);
        const created = await withdrawalDoc.save({ session });
        // Atomic Ledger Update - strictly deducts from totalDeposit, holds in pendingWithdrawal
        await member_model_1.Member.findByIdAndUpdate(member._id, {
            $inc: {
                totalDeposit: -depositDeduction,
                pendingWithdrawal: withdrawAmount,
            },
        }, { session, runValidators: true });
        await session.commitTransaction();
        // Notify Admin via Socket/DB
        notification_service_1.NotificationServices.createNotification({
            recipientId: member._id,
            title: "New Withdrawal Request",
            message: `Member ${member.fullName} requested a withdrawal of ৳${withdrawAmount.toLocaleString()} from deposit.`,
            type: "WITHDRAWAL_REQUEST",
            channel: ["IN_APP"],
            metadata: { withdrawalId: created._id },
        }).catch(err => console.error("Failed to notify admins of withdrawal request:", err));
        return {
            withdrawal: created,
            profitDeduction: 0,
            depositDeduction,
            remainingDeposit: Math.max(0, availableDeposit - withdrawAmount),
        };
    }
    catch (error) {
        if (session) {
            await session.abortTransaction().catch(() => { });
        }
        if (error?.message?.includes("replica set") ||
            error?.message?.includes("Transaction numbers")) {
            const withdrawalDoc = new withdrawal_model_1.Withdrawal(docData);
            const created = await withdrawalDoc.save();
            // Fallback Atomic Ledger Update if replica set is not configured
            await member_model_1.Member.findByIdAndUpdate(member._id, {
                $inc: {
                    totalDeposit: -depositDeduction,
                    pendingWithdrawal: withdrawAmount,
                },
            });
            // Notify Admin via Socket/DB
            notification_service_1.NotificationServices.createNotification({
                recipientId: member._id,
                title: "New Withdrawal Request",
                message: `Member ${member.fullName} requested a withdrawal of ৳${withdrawAmount.toLocaleString()} from deposit.`,
                type: "WITHDRAWAL_REQUEST",
                channel: ["IN_APP"],
                metadata: { withdrawalId: created._id },
            }).catch(err => console.error("Failed to notify admins of withdrawal request:", err));
            return {
                withdrawal: created,
                profitDeduction: 0,
                depositDeduction,
                remainingDeposit: Math.max(0, availableDeposit - withdrawAmount),
            };
        }
        throw error;
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
};
/**
 * 2. Admin Respond: Approve or Reject a Withdrawal Request
 * PATCH /api/v1/withdrawals/:id/respond
 */
const respondWithdrawalInDB = async (id, payload, adminUser) => {
    const isApproved = payload.action === "approve" || payload.action === "Approved";
    const isRejected = payload.action === "reject" || payload.action === "Rejected";
    if (!isApproved && !isRejected) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Action must be either 'approve' or 'reject'");
    }
    // Find withdrawal by _id or referenceId
    const query = mongoose_1.default.Types.ObjectId.isValid(id)
        ? { _id: id }
        : {
            $or: [
                { referenceId: id },
                { referenceId: `WD-${id}` },
                { referenceId: id.replace(/^WD-/, "") },
            ],
        };
    const withdrawal = await withdrawal_model_1.Withdrawal.findOne(query);
    if (!withdrawal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Withdrawal request not found");
    }
    if (withdrawal.status !== "Pending") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot respond to withdrawal request already marked as ${withdrawal.status}`);
    }
    const member = await member_model_1.Member.findById(withdrawal.memberId);
    const memberName = member?.fullName || withdrawal.memberName;
    const adminName = payload.reviewerName ||
        adminUser?.name ||
        adminUser?.email?.split("@")[0] ||
        (isApproved ? "Rania Islam" : "Tarek Farouq");
    const adminAvatar = adminName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const updatedStatus = isApproved ? "Approved" : "Rejected";
    const adminNote = payload.adminNote?.trim();
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        // 1. Update Withdrawal Request
        withdrawal.status = updatedStatus;
        if (adminNote) {
            withdrawal.adminNote = adminNote;
        }
        withdrawal.reviewedByName = adminName;
        withdrawal.reviewedAt = new Date();
        if (adminUser?._id && mongoose_1.default.Types.ObjectId.isValid(adminUser._id)) {
            withdrawal.reviewedBy = adminUser._id;
        }
        await withdrawal.save({ session });
        // 2. Member Ledger balance adjustment
        if (isApproved) {
            // Clear held pending amount, increment totalWithdrawn
            if (withdrawal.memberId) {
                await member_model_1.Member.findByIdAndUpdate(withdrawal.memberId, {
                    $inc: {
                        totalWithdrawn: withdrawal.amount,
                        pendingWithdrawal: -withdrawal.amount,
                    },
                }, { session });
            }
        }
        else {
            // Reject: refund held funds back to totalDeposit and clear pending
            if (withdrawal.memberId) {
                await member_model_1.Member.findByIdAndUpdate(withdrawal.memberId, {
                    $inc: {
                        totalDeposit: withdrawal.amount,
                        pendingWithdrawal: -withdrawal.amount,
                    },
                }, { session });
            }
        }
        await session.commitTransaction();
    }
    catch (error) {
        if (session) {
            await session.abortTransaction().catch(() => { });
        }
        if (error?.message?.includes("replica set") ||
            error?.message?.includes("Transaction numbers")) {
            withdrawal.status = updatedStatus;
            if (adminNote) {
                withdrawal.adminNote = adminNote;
            }
            withdrawal.reviewedByName = adminName;
            withdrawal.reviewedAt = new Date();
            await withdrawal.save();
            if (isApproved) {
                if (withdrawal.memberId) {
                    await member_model_1.Member.findByIdAndUpdate(withdrawal.memberId, {
                        $inc: {
                            totalWithdrawn: withdrawal.amount,
                            pendingWithdrawal: -withdrawal.amount,
                        },
                    });
                }
            }
            else {
                if (withdrawal.memberId) {
                    await member_model_1.Member.findByIdAndUpdate(withdrawal.memberId, {
                        $inc: {
                            totalDeposit: withdrawal.amount,
                            pendingWithdrawal: -withdrawal.amount,
                        },
                    });
                }
            }
        }
        else {
            throw error;
        }
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
    // 3. Create AuditLog entry matching specifications
    if (isApproved) {
        await auditLog_service_1.AuditLogServices.createAuditLogInDB({
            adminName,
            adminAvatar,
            action: "Withdrawal Approved",
            target: memberName,
            details: `Withdrawal request ${withdrawal.referenceId} approved for ${withdrawal.amount.toLocaleString()}.`,
        });
    }
    else {
        await auditLog_service_1.AuditLogServices.createAuditLogInDB({
            adminName,
            adminAvatar,
            action: "Withdrawal Rejected",
            target: memberName,
            details: `Request ${withdrawal.referenceId} rejected — ${adminNote || "insufficient profit"}.`,
        });
    }
    return withdrawal;
};
/**
 * 3. Get All Withdrawal Requests with counts & pagination
 */
const getWithdrawalsFromDB = async (query) => {
    const filter = {};
    if (query.memberId) {
        filter.memberId = new mongoose_1.default.Types.ObjectId(query.memberId);
    }
    if (query.status && query.status !== "All") {
        filter.status = query.status;
    }
    if (query.search) {
        const searchRegex = new RegExp(query.search, "i");
        filter.$or = [
            { referenceId: searchRegex },
            { memberName: searchRegex },
            { memberCode: searchRegex },
            { accountDetails: searchRegex },
            { reason: searchRegex },
        ];
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const [data, total, pendingCount, approvedCount, rejectedCount] = await Promise.all([
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "members",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "memberData"
                }
            },
            {
                $addFields: {
                    member: { $arrayElemAt: ["$memberData", 0] }
                }
            },
            {
                $project: {
                    memberData: 0 // exclude raw lookup array
                }
            }
        ]),
        withdrawal_model_1.Withdrawal.countDocuments(filter),
        withdrawal_model_1.Withdrawal.countDocuments({ status: "Pending" }),
        withdrawal_model_1.Withdrawal.countDocuments({ status: "Approved" }),
        withdrawal_model_1.Withdrawal.countDocuments({ status: "Rejected" }),
    ]);
    const allCount = pendingCount + approvedCount + rejectedCount;
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit) || 1,
            counts: {
                all: allCount,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
            },
        },
        data,
    };
};
exports.WithdrawalServices = {
    createWithdrawalRequestInDB,
    respondWithdrawalInDB,
    getWithdrawalsFromDB,
};
//# sourceMappingURL=withdrawal.service.js.map