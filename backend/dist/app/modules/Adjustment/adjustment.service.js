"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const member_model_1 = require("../Member/member.model");
const adjustment_model_1 = require("./adjustment.model");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
const TYPE_NAME_MAP = {
    ADD: "Add Deposit",
    SUB: "Deduct Balance",
    OTHER_RECEIVED: "Other Received",
};
/**
 * 1. Create Adjustment with atomic financial recalculation
 */
const createAdjustmentInDB = async (payload, userId) => {
    const { memberId, adjustmentType, adjustmentDate, adjustmentAmount, remarks } = payload;
    const amount = Number(adjustmentAmount);
    if (isNaN(amount) || amount === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Adjustment amount cannot be zero");
    }
    // 1. Fetch Member (support both ObjectId and memberCode)
    let member = null;
    if (mongoose_1.default.Types.ObjectId.isValid(memberId)) {
        member = await member_model_1.Member.findById(memberId);
    }
    if (!member) {
        member = await member_model_1.Member.findOne({
            $or: [{ memberCode: memberId }, { mobileNo: memberId }, { email: memberId }],
        });
    }
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Active member record not found");
    }
    // Snapshot previous balances
    const prevDeposit = Number(member.totalDeposit?.toString?.() ?? member.totalDeposit ?? 0);
    const prevSavings = Number(member.savingsBalance?.toString?.() ?? member.savingsBalance ?? 0);
    const prevDue = Number(member.dueAmount?.toString?.() ?? member.dueAmount ?? 0);
    const prevProfit = Number(member.profitBalance?.toString?.() ?? member.profitBalance ?? 0);
    const prevOthers = Number(member.othersReceived?.toString?.() ?? member.othersReceived ?? 0);
    const previousBalance = {
        totalDeposit: prevDeposit,
        savingsBalance: prevSavings,
        dueAmount: prevDue,
        profitBalance: prevProfit,
    };
    let newDeposit = prevDeposit;
    let newSavings = prevSavings;
    let newDue = prevDue;
    let newProfit = prevProfit;
    let newOthers = prevOthers;
    let signedAmount = amount;
    // 2. Financial Ledger Recalculation Math
    const normalizedType = adjustmentType.toUpperCase();
    switch (normalizedType) {
        case "ADD": {
            signedAmount = amount;
            newDeposit = prevDeposit + amount;
            if (prevDue > 0) {
                if (amount <= prevDue) {
                    newDue = prevDue - amount;
                    newSavings = prevSavings;
                }
                else {
                    const excess = amount - prevDue;
                    newDue = 0;
                    newSavings = prevSavings + excess;
                }
            }
            else {
                newSavings = prevSavings + amount;
                newDue = 0;
            }
            break;
        }
        case "SUB": {
            signedAmount = -Math.abs(amount);
            newDeposit = Math.max(0, prevDeposit - Math.abs(amount));
            if (prevSavings >= Math.abs(amount)) {
                newSavings = prevSavings - Math.abs(amount);
                newDue = prevDue;
            }
            else {
                const shortfall = Math.abs(amount) - prevSavings;
                newSavings = 0;
                newDue = prevDue + shortfall;
            }
            break;
        }
        case "OTHER_RECEIVED": {
            signedAmount = amount;
            newOthers = prevOthers + amount;
            break;
        }
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid adjustment type: ${adjustmentType}`);
    }
    const updatedBalance = {
        totalDeposit: newDeposit,
        savingsBalance: newSavings,
        dueAmount: newDue,
        profitBalance: newProfit,
    };
    // Generate Sequential adjustmentId (matching Screenshot 2: 130, 131, 132...)
    const lastRecord = await adjustment_model_1.Adjustment.findOne().sort({ createdAt: -1 });
    let nextNumericId = 130;
    if (lastRecord && !isNaN(Number(lastRecord.adjustmentId))) {
        nextNumericId = Math.max(130, Number(lastRecord.adjustmentId) + 1);
    }
    const adjustmentId = String(nextNumericId);
    const docData = {
        adjustmentId,
        memberId: member._id,
        memberCode: member.memberCode,
        memberName: member.fullName,
        adjustmentType,
        adjustmentTypeName: TYPE_NAME_MAP[adjustmentType] || "Balance Adjustment",
        adjustmentDate: new Date(adjustmentDate || Date.now()),
        adjustmentAmount: amount,
        signedAmount,
        previousBalance,
        updatedBalance,
        remarks,
        isDeleted: false,
    };
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        docData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    // Execute with Session / Transaction if replica set is available, else fallback
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        const adjustmentDoc = new adjustment_model_1.Adjustment(docData);
        const createdAdjustment = await adjustmentDoc.save({ session });
        // Update member balances
        await member_model_1.Member.findByIdAndUpdate(member._id, {
            totalDeposit: newDeposit,
            savingsBalance: newSavings,
            dueAmount: newDue,
            profitBalance: newProfit,
            othersReceived: newOthers,
        }, { session, runValidators: true });
        await session.commitTransaction();
        await auditLog_service_1.AuditLogServices.createAuditLogInDB({
            adminName: "Super Admin",
            adminRole: "Super Admin",
            action: adjustmentType === "ADD" ? "Due Updated" : "Amount Modified",
            target: `${member.fullName} (${member.memberCode})`,
            details: `Balance adjustment of ৳${amount.toLocaleString()} (${adjustmentType}) applied to ${member.fullName}. Remarks: ${remarks || "N/A"}`,
        }).catch((err) => console.error("Failed to record adjustment audit log:", err));
        return createdAdjustment;
    }
    catch (error) {
        if (session) {
            await session.abortTransaction().catch(() => { });
        }
        // If replica set is not configured (e.g. standalone Mongo dev), perform atomic direct operations
        if (error?.message?.includes("replica set") || error?.message?.includes("Transaction numbers")) {
            const adjustmentDoc = new adjustment_model_1.Adjustment(docData);
            const createdAdjustment = await adjustmentDoc.save();
            await member_model_1.Member.findByIdAndUpdate(member._id, {
                totalDeposit: newDeposit,
                savingsBalance: newSavings,
                dueAmount: newDue,
                profitBalance: newProfit,
                othersReceived: newOthers,
            }, { runValidators: true });
            await auditLog_service_1.AuditLogServices.createAuditLogInDB({
                adminName: "Super Admin",
                adminRole: "Super Admin",
                action: adjustmentType === "ADD" ? "Due Updated" : "Amount Modified",
                target: `${member.fullName} (${member.memberCode})`,
                details: `Balance adjustment of ৳${amount.toLocaleString()} (${adjustmentType}) applied to ${member.fullName}. Remarks: ${remarks || "N/A"}`,
            }).catch((err) => console.error("Failed to record adjustment audit log:", err));
            return createdAdjustment;
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
 * 2. Get Filtered Adjustments with Date Range & Pagination
 */
const getAdjustmentsFromDB = async (filters) => {
    const query = {};
    // Date Range Filtering (From Date & To Date)
    if (filters.fromDate || filters.toDate) {
        query.adjustmentDate = {};
        if (filters.fromDate) {
            query.adjustmentDate.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
            const endOfDay = new Date(filters.toDate);
            endOfDay.setHours(23, 59, 59, 999);
            query.adjustmentDate.$lte = endOfDay;
        }
    }
    // Type filter
    if (filters.adjustmentType && filters.adjustmentType !== "All") {
        query.adjustmentType = filters.adjustmentType;
    }
    // Search filter (Member Name, Code, or Adjustment ID)
    if (filters.searchTerm) {
        const term = filters.searchTerm.trim();
        query.$or = [
            { memberName: { $regex: term, $options: "i" } },
            { memberCode: { $regex: term, $options: "i" } },
            { adjustmentId: { $regex: term, $options: "i" } },
            { remarks: { $regex: term, $options: "i" } },
        ];
    }
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        adjustment_model_1.Adjustment.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        adjustment_model_1.Adjustment.countDocuments(query),
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
/**
 * 3. Get Single Adjustment Details by ID
 */
const getSingleAdjustmentFromDB = async (id) => {
    const adjustment = await adjustment_model_1.Adjustment.findOne({
        $or: [
            { adjustmentId: id },
            ...(mongoose_1.default.isValidObjectId(id) ? [{ _id: id }] : []),
        ],
    }).populate("memberId", "fullName memberCode email mobileNo totalDeposit dueAmount savingsBalance");
    if (!adjustment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Adjustment record not found");
    }
    return adjustment;
};
exports.AdjustmentServices = {
    createAdjustmentInDB,
    getAdjustmentsFromDB,
    getSingleAdjustmentFromDB,
};
//# sourceMappingURL=adjustment.service.js.map