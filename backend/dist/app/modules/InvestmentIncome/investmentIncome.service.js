"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentIncomeService = exports.recalculateAndDistributeAllMemberProfits = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const investmentIncome_model_1 = require("./investmentIncome.model");
const investment_model_1 = require("../Investment/investment.model");
const member_model_1 = require("../Member/member.model");
const stats_model_1 = require("../Stats/stats.model");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
// ─── Dynamic Equal Profit Distribution Engine ────────────────────────────────
const recalculateAndDistributeAllMemberProfits = async (session) => {
    const incomeAgg = await investmentIncome_model_1.InvestmentIncome.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).session(session || null);
    const totalInvestmentIncome = incomeAgg[0]?.total || 0;
    const activeMembers = await member_model_1.Member.find({
        isDeleted: false,
        status: { $regex: /^active$/i },
    }).session(session || null);
    const activeCount = activeMembers.length;
    const perMemberEqualShare = activeCount > 0
        ? Number((totalInvestmentIncome / activeCount).toFixed(2))
        : 0;
    // Check disbursements to ensure accounting integrity
    const { Disbursement } = await Promise.resolve().then(() => __importStar(require("../Disbursement/disbursement.model")));
    const disbursementsAgg = await Disbursement.aggregate([
        { $group: { _id: "$memberId", totalDisbursed: { $sum: "$disbursedAmount" } } },
    ]).session(session || null);
    const disbursedMap = new Map();
    for (const d of disbursementsAgg) {
        if (d._id)
            disbursedMap.set(d._id.toString(), d.totalDisbursed || 0);
    }
    for (const member of activeMembers) {
        const memberIdStr = member._id.toString();
        const disbursed = disbursedMap.get(memberIdStr) || 0;
        const finalProfit = Math.max(0, Number((perMemberEqualShare - disbursed).toFixed(2)));
        await member_model_1.Member.findByIdAndUpdate(member._id, { $set: { profitBalance: finalProfit } }, session ? { session } : undefined);
    }
    return {
        totalInvestmentIncome,
        activeCount,
        perMemberEqualShare,
    };
};
exports.recalculateAndDistributeAllMemberProfits = recalculateAndDistributeAllMemberProfits;
const createInvestmentIncome = async (payload, userId) => {
    const amount = Number(payload.amount);
    if (isNaN(amount) || amount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Amount must be a positive number");
    }
    // 1. Verify Investment
    const investment = await investment_model_1.Investment.findById(payload.investmentId);
    if (!investment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Investment not found");
    }
    // 2. Fetch Active Members Count
    const activeMembers = await member_model_1.Member.find({
        isDeleted: false,
        status: { $regex: /^active$/i },
    });
    const activeMembersCount = activeMembers.length;
    const perMemberProfit = activeMembersCount > 0 ? Number((amount / activeMembersCount).toFixed(2)) : 0;
    const nextNumericId = await investmentIncome_model_1.InvestmentIncome.getNextNumericId();
    const incomeData = {
        numericId: nextNumericId,
        investmentId: investment._id,
        investmentName: investment.name,
        date: new Date(payload.date),
        amount,
        remarks: payload.remarks,
        distributedToCount: activeMembersCount,
        perMemberProfit,
    };
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        incomeData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    let session = null;
    try {
        session = await mongoose_1.default.startSession();
        session.startTransaction();
        const newIncome = new investmentIncome_model_1.InvestmentIncome(incomeData);
        await newIncome.save({ session });
        // Re-evaluate entire investment profit pool equally across all active members
        await (0, exports.recalculateAndDistributeAllMemberProfits)(session);
        // Global Metrics update if required (StatCounter)
        const netProfitStat = await stats_model_1.StatCounter.findOne({ key: "total_net_profit" }).session(session);
        if (netProfitStat) {
            const currentVal = Number(netProfitStat.value) || 0;
            netProfitStat.value = (currentVal + amount).toString();
            await netProfitStat.save({ session });
        }
        const totalBalanceStat = await stats_model_1.StatCounter.findOne({ key: "total_balance" }).session(session);
        if (totalBalanceStat) {
            const currentVal = Number(totalBalanceStat.value) || 0;
            totalBalanceStat.value = (currentVal + amount).toString();
            await totalBalanceStat.save({ session });
        }
        await session.commitTransaction();
        await auditLog_service_1.AuditLogServices.createAuditLogInDB({
            adminName: "Super Admin",
            adminRole: "Super Admin",
            action: "Amount Modified",
            target: `${investment.name}`,
            details: `Investment income of ৳${amount.toLocaleString()} distributed among ${activeMembersCount} active members (৳${perMemberProfit} each) for "${investment.name}".`,
        }).catch((err) => console.error("Failed to record investment income audit log:", err));
        return newIncome;
    }
    catch (error) {
        if (session) {
            await session.abortTransaction().catch(() => { });
        }
        // Fallback for standalone MongoDB environments without replica set
        if (error?.message?.includes("replica set") ||
            error?.message?.includes("Transaction numbers")) {
            const newIncome = new investmentIncome_model_1.InvestmentIncome(incomeData);
            await newIncome.save();
            await (0, exports.recalculateAndDistributeAllMemberProfits)();
            await auditLog_service_1.AuditLogServices.createAuditLogInDB({
                adminName: "Super Admin",
                adminRole: "Super Admin",
                action: "Amount Modified",
                target: `${investment.name}`,
                details: `Investment income of ৳${amount.toLocaleString()} distributed among ${activeMembersCount} active members (৳${perMemberProfit} each) for "${investment.name}".`,
            }).catch((err) => console.error("Failed to record investment income audit log:", err));
            return newIncome;
        }
        throw error;
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
};
const getInvestmentIncomes = async (query) => {
    const { fromDate, toDate } = query;
    const filter = { isDeleted: false };
    if (fromDate || toDate) {
        filter.date = {};
        if (fromDate)
            filter.date.$gte = new Date(fromDate);
        if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            filter.date.$lte = end;
        }
    }
    const incomes = await investmentIncome_model_1.InvestmentIncome.find(filter).sort({ date: -1, createdAt: -1 });
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    return {
        incomes,
        totalIncome,
        totalRecords: incomes.length,
    };
};
exports.InvestmentIncomeService = {
    createInvestmentIncome,
    getInvestmentIncomes,
    recalculateAndDistributeAllMemberProfits: exports.recalculateAndDistributeAllMemberProfits,
};
//# sourceMappingURL=investmentIncome.service.js.map