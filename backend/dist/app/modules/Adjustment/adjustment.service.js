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
const TYPE_NAME_MAP = {
    credit: "Balance Adjustment",
    debit: "Balance Adjustment",
    fee_reversal: "Fee Reversal",
    operational: "Operational Adjustment",
};
/**
 * 1. Create Adjustment with atomic financial recalculation
 */
const createAdjustmentInDB = async (payload, userId) => {
    const { memberId, adjustmentType, adjustmentDate, adjustmentAmount, remarks } = payload;
    const amount = Number(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Adjustment amount must be a positive number");
    }
    // 1. Fetch Member
    const member = await member_model_1.Member.findById(memberId);
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Active member record not found");
    }
    // Snapshot previous balances
    const prevDeposit = member.totalDeposit || 0;
    const prevSavings = member.savingsBalance || 0;
    const prevDue = member.dueAmount || 0;
    const previousBalance = {
        totalDeposit: prevDeposit,
        savingsBalance: prevSavings,
        dueAmount: prevDue,
    };
    let newDeposit = prevDeposit;
    let newSavings = prevSavings;
    let newDue = prevDue;
    let signedAmount = amount;
    // 2. Financial Ledger Recalculation Math
    switch (adjustmentType) {
        case "credit": {
            // Credit: Add to lifetime deposit. Clear dues first, remainder to advance/savings
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
        case "debit": {
            // Debit: Excess payment recorded by mistake. Deduct from lifetime deposit and savings.
            // If savings insufficient, restore due amount.
            signedAmount = -amount;
            newDeposit = Math.max(0, prevDeposit - amount);
            if (prevSavings >= amount) {
                newSavings = prevSavings - amount;
                newDue = prevDue;
            }
            else {
                const shortfall = amount - prevSavings;
                newSavings = 0;
                newDue = prevDue + shortfall;
            }
            break;
        }
        case "fee_reversal": {
            // Fee Reversal: Waive dues/penalties
            signedAmount = amount;
            newDue = Math.max(0, prevDue - amount);
            break;
        }
        case "operational": {
            // Operational: Manual adjustments
            signedAmount = amount;
            newDeposit = prevDeposit + amount;
            newSavings = prevSavings + amount;
            break;
        }
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid adjustment type");
    }
    const updatedBalance = {
        totalDeposit: newDeposit,
        savingsBalance: newSavings,
        dueAmount: newDue,
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
        }, { session, runValidators: true });
        await session.commitTransaction();
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
            }, { runValidators: true });
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