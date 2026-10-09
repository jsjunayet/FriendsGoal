import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { InvestmentIncome } from "./investmentIncome.model";
import { Investment } from "../Investment/investment.model";
import { Member } from "../Member/member.model";
import { StatCounter } from "../Stats/stats.model";
import { AuditLogServices } from "../AuditLog/auditLog.service";

const createInvestmentIncome = async (payload: any, userId?: string) => {
  const amount = Number(payload.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be a positive number");
  }

  // 1. Verify Investment
  const investment = await Investment.findById(payload.investmentId);
  if (!investment) {
    throw new AppError(httpStatus.NOT_FOUND, "Investment not found");
  }

  // 2. Fetch Active Members
  const activeMembers = await Member.find({
    isDeleted: false,
    status: { $regex: /^active$/i },
  });

  const activeMembersCount = activeMembers.length;
  const perMemberProfit = activeMembersCount > 0 ? Number((amount / activeMembersCount).toFixed(2)) : 0;
  const nextNumericId = await InvestmentIncome.getNextNumericId();

  const incomeData: any = {
    numericId: nextNumericId,
    investmentId: investment._id,
    investmentName: investment.name,
    date: new Date(payload.date),
    amount,
    remarks: payload.remarks,
    distributedToCount: activeMembersCount,
    perMemberProfit,
  };

  if (userId && mongoose.isValidObjectId(userId)) {
    incomeData.createdBy = new mongoose.Types.ObjectId(userId);
  }

  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const newIncome = new InvestmentIncome(incomeData);
    await newIncome.save({ session });

    // Update each active member's profitBalance
    if (activeMembersCount > 0) {
      await Member.updateMany(
        { _id: { $in: activeMembers.map((m) => m._id) } },
        { $inc: { profitBalance: perMemberProfit } },
        { session }
      );
    }

    // Global Metrics update if required (StatCounter)
    const netProfitStat = await StatCounter.findOne({ key: "total_net_profit" }).session(session);
    if (netProfitStat) {
      const currentVal = Number(netProfitStat.value) || 0;
      netProfitStat.value = (currentVal + amount).toString();
      await netProfitStat.save({ session });
    }

    const totalBalanceStat = await StatCounter.findOne({ key: "total_balance" }).session(session);
    if (totalBalanceStat) {
      const currentVal = Number(totalBalanceStat.value) || 0;
      totalBalanceStat.value = (currentVal + amount).toString();
      await totalBalanceStat.save({ session });
    }

    await session.commitTransaction();

    await AuditLogServices.createAuditLogInDB({
      adminName: "Super Admin",
      adminRole: "Super Admin",
      action: "Amount Modified",
      target: `${investment.name}`,
      details: `Investment income of ৳${amount.toLocaleString()} distributed among ${activeMembersCount} active members (৳${perMemberProfit} each) for "${investment.name}".`,
    }).catch((err) => console.error("Failed to record investment income audit log:", err));

    return newIncome;
  } catch (error: any) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }

    // Fallback for standalone MongoDB environments without replica set
    if (
      error?.message?.includes("replica set") ||
      error?.message?.includes("Transaction numbers")
    ) {
      const newIncome = new InvestmentIncome(incomeData);
      await newIncome.save();

      if (activeMembersCount > 0) {
        await Member.updateMany(
          { _id: { $in: activeMembers.map((m) => m._id) } },
          { $inc: { profitBalance: perMemberProfit } }
        );
      }

      await AuditLogServices.createAuditLogInDB({
        adminName: "Super Admin",
        adminRole: "Super Admin",
        action: "Amount Modified",
        target: `${investment.name}`,
        details: `Investment income of ৳${amount.toLocaleString()} distributed among ${activeMembersCount} active members (৳${perMemberProfit} each) for "${investment.name}".`,
      }).catch((err) => console.error("Failed to record investment income audit log:", err));

      return newIncome;
    }

    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const getInvestmentIncomes = async (query: Record<string, unknown>) => {
  const { fromDate, toDate } = query;
  const filter: any = { isDeleted: false };

  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate as string);
    if (toDate) {
      const end = new Date(toDate as string);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const incomes = await InvestmentIncome.find(filter).sort({ date: -1, createdAt: -1 });

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

  return {
    incomes,
    totalIncome,
    totalRecords: incomes.length,
  };
};

export const InvestmentIncomeService = {
  createInvestmentIncome,
  getInvestmentIncomes,
};
