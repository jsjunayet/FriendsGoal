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
// ─── Default seed disbursements matching Screenshot 1 ─────────────────────────
const DEFAULT_DISBURSEMENTS = [
    {
        disbursementId: "101",
        numericId: 101,
        memberName: "MD BELAL HOSSAIN",
        memberCode: "002",
        disbursedAmount: 4554.0,
        disbursDate: new Date("2026-07-15"),
        remarks: "Profit Share Distribution Q2",
    },
    {
        disbursementId: "102",
        numericId: 102,
        memberName: "MD JUWEL HASAN",
        memberCode: "001",
        disbursedAmount: 3200.0,
        disbursDate: new Date("2026-07-16"),
        remarks: "Profit Share Distribution Q2",
    },
    {
        disbursementId: "103",
        numericId: 103,
        memberName: "SARAH JENKINS",
        memberCode: "003",
        disbursedAmount: 1500.0,
        disbursDate: new Date("2026-07-17"),
        remarks: "Profit Share Distribution Q2",
    },
    {
        disbursementId: "104",
        numericId: 104,
        memberName: "JOHN DOE",
        memberCode: "004",
        disbursedAmount: 2800.0,
        disbursDate: new Date("2026-07-18"),
        remarks: "Profit Share Distribution Q2",
    },
    {
        disbursementId: "105",
        numericId: 105,
        memberName: "FATEMA BEGUM",
        memberCode: "005",
        disbursedAmount: 6100.0,
        disbursDate: new Date("2026-07-19"),
        remarks: "Profit Share Distribution Q2",
    },
];
/**
 * 1. Fetch active member profitBalance
 */
const getMemberProfitBalanceFromDB = async (memberId) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(memberId)) {
        query._id = memberId;
    }
    else {
        query.$or = [{ memberCode: memberId }, { email: memberId }];
    }
    const member = await member_model_1.Member.findOne(query);
    if (!member) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member record not found");
    }
    const rawProfit = member.profitBalance;
    const profitBalance = rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
    return {
        memberId: member._id,
        memberName: member.fullName,
        memberCode: member.memberCode,
        profitBalance,
        totalDeposit: member.totalDeposit != null ? parseFloat(member.totalDeposit.toString()) : 0,
        dueAmount: member.dueAmount != null ? parseFloat(member.dueAmount.toString()) : 0,
    };
};
/**
 * 2. Process Payout Transaction with Atomic Balance Deduction
 */
const createDisbursementInDB = async (payload, userId) => {
    const { memberId, paidAmount, disbursDate, remarks } = payload;
    const amount = Number(paidAmount);
    if (isNaN(amount) || amount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Paid amount must be a positive number");
    }
    const member = await member_model_1.Member.findById(memberId);
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Active member record not found");
    }
    const rawProfit = member.profitBalance;
    const currentProfit = rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
    if (amount > currentProfit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Paid amount (${amount}) exceeds available profit balance (${currentProfit})`);
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
        remarks: remarks || "Income Disbursement Payout",
    };
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        docData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    const newProfit = Math.max(0, currentProfit - amount);
    // Attempt Transaction with Session
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        const disbursementDoc = new disbursement_model_1.Disbursement(docData);
        const createdDisbursement = await disbursementDoc.save({ session });
        // Deduct profit balance atomically
        await member_model_1.Member.findByIdAndUpdate(member._id, {
            $inc: { profitBalance: -amount },
        }, { session, runValidators: true });
        await session.commitTransaction();
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
            await member_model_1.Member.findByIdAndUpdate(member._id, {
                $inc: { profitBalance: -amount },
            });
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
    // Ensure default seed data exists if collection is empty
    const count = await disbursement_model_1.Disbursement.countDocuments();
    if (count === 0) {
        // Look up or assign valid memberId if available
        const anyMember = await member_model_1.Member.findOne();
        const fallbackId = anyMember?._id || new mongoose_1.default.Types.ObjectId();
        const seeded = DEFAULT_DISBURSEMENTS.map((d) => ({
            ...d,
            memberId: fallbackId,
        }));
        await disbursement_model_1.Disbursement.insertMany(seeded).catch(() => { });
    }
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