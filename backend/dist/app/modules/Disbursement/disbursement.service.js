"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const disbursement_model_1 = require("./disbursement.model");
const member_model_1 = require("../Member/member.model");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
/**
 * 1. Fetch active member profitBalance
 */
const getMemberProfitBalanceFromDB = async (memberId) => {
    let member = null;
    if (mongoose_1.default.isValidObjectId(memberId)) {
        member = await member_model_1.Member.findOne({ _id: memberId, isDeleted: false });
    }
    if (!member) {
        const cleanId = decodeURIComponent(memberId).trim();
        member = await member_model_1.Member.findOne({
            isDeleted: false,
            $or: [
                { memberCode: cleanId },
                { email: cleanId },
                { fullName: { $regex: new RegExp(`^${cleanId}$`, "i") } },
            ],
        });
    }
    if (!member) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member record not found");
    }
    const rawProfit = member.profitBalance;
    const profitBalance = rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
    return {
        memberId: member._id,
        memberName: member.fullName,
        fullName: member.fullName,
        memberCode: member.memberCode,
        profitBalance,
        totalDeposit: member.totalDeposit != null ? parseFloat(member.totalDeposit.toString()) : 0,
        dueAmount: member.dueAmount != null ? parseFloat(member.dueAmount.toString()) : 0,
    };
};
/**
 * 2. Process Payout Transaction with Atomic Balance Deduction & Merging to Deposit
 */
const createDisbursementInDB = async (payload, userId) => {
    const { memberId, paidAmount, disbursDate, remarks } = payload;
    const amount = Number(paidAmount);
    if (isNaN(amount) || amount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Paid amount must be a positive number");
    }
    let member = null;
    if (mongoose_1.default.isValidObjectId(memberId)) {
        member = await member_model_1.Member.findOne({ _id: memberId, isDeleted: false });
    }
    if (!member) {
        const cleanId = decodeURIComponent(memberId).trim();
        member = await member_model_1.Member.findOne({
            isDeleted: false,
            $or: [
                { memberCode: cleanId },
                { email: cleanId },
                { fullName: { $regex: new RegExp(`^${cleanId}$`, "i") } },
            ],
        });
    }
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Active member record not found");
    }
    const rawProfit = member.profitBalance;
    const currentProfit = rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
    if (amount > currentProfit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Paid amount (৳${amount}) exceeds available profit balance (৳${currentProfit})`);
    }
    const { disbursementId, numericId } = await disbursement_model_1.Disbursement.getNextDisbursementId();
    const docData = {
        disbursementId,
        numericId,
        memberId: member._id,
        memberName: member.fullName,
        memberCode: member.memberCode,
        disbursedAmount: amount,
        disbursDate: disbursDate ? new Date(disbursDate) : new Date(),
        remarks: remarks || "Profit Disbursement Payout - Merged into Deposit",
    };
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        docData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    // Attempt Transaction with Session
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        const disbursementDoc = new disbursement_model_1.Disbursement(docData);
        const createdDisbursement = await disbursementDoc.save({ session });
        // Deduct profit balance atomically and merge directly into totalDeposit!
        await member_model_1.Member.findByIdAndUpdate(member._id, {
            $inc: { profitBalance: -amount, totalDeposit: amount },
        }, { session, runValidators: true });
        await session.commitTransaction();
        await auditLog_service_1.AuditLogServices.createAuditLogInDB({
            adminName: "Super Admin",
            adminRole: "Super Admin",
            action: "Amount Modified",
            target: `${member.fullName} (${member.memberCode})`,
            details: `Profit disbursement payout of ৳${amount.toLocaleString()} paid to ${member.fullName} and merged into Total Deposit.`,
        }).catch((err) => console.error("Failed to record disbursement audit log:", err));
        return createdDisbursement;
    }
    catch (error) {
        if (session) {
            await session.abortTransaction().catch(() => { });
        }
        // Fallback for standalone Mongo environments without replica set
        if (error?.message?.includes("replica set") ||
            error?.message?.includes("Transaction numbers")) {
            const disbursementDoc = new disbursement_model_1.Disbursement(docData);
            const createdDisbursement = await disbursementDoc.save();
            // Deduct profit balance atomically and merge directly into totalDeposit!
            await member_model_1.Member.findByIdAndUpdate(member._id, {
                $inc: { profitBalance: -amount, totalDeposit: amount },
            });
            await auditLog_service_1.AuditLogServices.createAuditLogInDB({
                adminName: "Super Admin",
                adminRole: "Super Admin",
                action: "Amount Modified",
                target: `${member.fullName} (${member.memberCode})`,
                details: `Profit disbursement payout of ৳${amount.toLocaleString()} paid to ${member.fullName} and merged into Total Deposit.`,
            }).catch((err) => console.error("Failed to record disbursement audit log:", err));
            return createdDisbursement;
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
 * 3. Fetch Payout Audit List with Date Filtering & Search
 */
const getDisbursementsFromDB = async (filters) => {
    const query = {};
    // Date Range Filtering (From Date & To Date)
    if (filters.fromDate || filters.toDate) {
        query.disbursDate = {};
        if (filters.fromDate) {
            query.disbursDate.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            const endOfDay = new Date(filters.toDate);
            endOfDay.setHours(23, 59, 59, 999);
            query.disbursDate.$lte = endOfDay;
        }
    }
    if (filters.memberId) {
        if (mongoose_1.default.isValidObjectId(filters.memberId)) {
            query.memberId = filters.memberId;
        }
    }
    if (filters.search && filters.search.trim()) {
        const term = filters.search.trim();
        const isNum = !isNaN(Number(term));
        const orConditions = [
            { memberName: { $regex: term, $options: "i" } },
            { memberCode: { $regex: term, $options: "i" } },
            { disbursementId: { $regex: term, $options: "i" } },
            { remarks: { $regex: term, $options: "i" } },
        ];
        if (isNum) {
            orConditions.push({ disbursedAmount: Number(term) });
            orConditions.push({ numericId: Number(term) });
        }
        query.$or = orConditions;
    }
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        disbursement_model_1.Disbursement.find(query)
            .sort({ numericId: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        disbursement_model_1.Disbursement.countDocuments(query),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit) || 1,
        },
        data,
    };
};
exports.DisbursementServices = {
    getMemberProfitBalanceFromDB,
    createDisbursementInDB,
    getDisbursementsFromDB,
};
//# sourceMappingURL=disbursement.service.js.map