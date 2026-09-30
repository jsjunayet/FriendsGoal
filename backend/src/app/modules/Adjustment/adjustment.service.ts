import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Member } from "../Member/member.model";
import { Adjustment } from "./adjustment.model";
import {
  ICreateAdjustmentPayload,
  IAdjustmentFilterParams,
  TAdjustmentType,
  IAdjustmentBalanceSnapshot,
} from "./adjustment.interface";

const TYPE_NAME_MAP: Record<string, string> = {
  credit: "Balance Adjustment",
  debit: "Balance Adjustment",
  fee_reversal: "Fee Reversal",
  operational: "Operational Adjustment",
  PROFIT: "Profit Adjustment",
  profit: "Profit Adjustment",
  DEPOSIT: "Deposit Adjustment",
  deposit: "Deposit Adjustment",
  DUE: "Due Adjustment",
  due: "Due Adjustment",
};

/**
 * 1. Create Adjustment with atomic financial recalculation
 */
const createAdjustmentInDB = async (
  payload: ICreateAdjustmentPayload,
  userId?: string
) => {
  const { memberId, adjustmentType, adjustmentDate, adjustmentAmount, remarks } = payload;
  const amount = Number(adjustmentAmount);

  if (isNaN(amount) || amount === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Adjustment amount cannot be zero");
  }

  // 1. Fetch Member (support both ObjectId and memberCode)
  let member = null;
  if (mongoose.Types.ObjectId.isValid(memberId)) {
    member = await Member.findById(memberId);
  }
  if (!member) {
    member = await Member.findOne({
      $or: [{ memberCode: memberId }, { mobileNo: memberId }, { email: memberId }],
    });
  }
  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Active member record not found");
  }

  // Snapshot previous balances
  const prevDeposit = Number(member.totalDeposit?.toString?.() ?? member.totalDeposit ?? 0);
  const prevSavings = Number(member.savingsBalance?.toString?.() ?? member.savingsBalance ?? 0);
  const prevDue = Number(member.dueAmount?.toString?.() ?? member.dueAmount ?? 0);
  const prevProfit = Number((member as any).profitBalance?.toString?.() ?? (member as any).profitBalance ?? 0);

  const previousBalance: IAdjustmentBalanceSnapshot = {
    totalDeposit: prevDeposit,
    savingsBalance: prevSavings,
    dueAmount: prevDue,
    profitBalance: prevProfit,
  };

  let newDeposit = prevDeposit;
  let newSavings = prevSavings;
  let newDue = prevDue;
  let newProfit = prevProfit;
  let signedAmount = amount;

  // 2. Financial Ledger Recalculation Math
  const normalizedType = adjustmentType.toUpperCase();
  switch (normalizedType) {
    case "PROFIT": {
      // Positive amount: $inc { profitBalance: amount }, Negative amount: $inc { profitBalance: -amount }
      signedAmount = amount;
      newProfit = Math.max(0, prevProfit + amount);
      break;
    }

    case "DEPOSIT": {
      // Update totalDeposit
      signedAmount = amount;
      newDeposit = Math.max(0, prevDeposit + amount);
      newSavings = Math.max(0, prevSavings + amount);
      break;
    }

    case "DUE": {
      // Update dueAmount
      signedAmount = amount;
      newDue = Math.max(0, prevDue + amount);
      break;
    }

    case "CREDIT": {
      // Credit: Add to lifetime deposit. Clear dues first, remainder to advance/savings
      signedAmount = amount;
      newDeposit = prevDeposit + amount;
      if (prevDue > 0) {
        if (amount <= prevDue) {
          newDue = prevDue - amount;
          newSavings = prevSavings;
        } else {
          const excess = amount - prevDue;
          newDue = 0;
          newSavings = prevSavings + excess;
        }
      } else {
        newSavings = prevSavings + amount;
        newDue = 0;
      }
      break;
    }

    case "DEBIT": {
      // Debit: Excess payment recorded by mistake. Deduct from lifetime deposit and savings.
      signedAmount = -Math.abs(amount);
      newDeposit = Math.max(0, prevDeposit - Math.abs(amount));
      if (prevSavings >= Math.abs(amount)) {
        newSavings = prevSavings - Math.abs(amount);
        newDue = prevDue;
      } else {
        const shortfall = Math.abs(amount) - prevSavings;
        newSavings = 0;
        newDue = prevDue + shortfall;
      }
      break;
    }

    case "FEE_REVERSAL": {
      // Fee Reversal: Waive dues/penalties
      signedAmount = amount;
      newDue = Math.max(0, prevDue - amount);
      break;
    }

    case "OPERATIONAL": {
      // Operational: Manual adjustments
      signedAmount = amount;
      newDeposit = prevDeposit + amount;
      newSavings = prevSavings + amount;
      break;
    }

    default:
      throw new AppError(httpStatus.BAD_REQUEST, `Invalid adjustment type: ${adjustmentType}`);
  }

  const updatedBalance: IAdjustmentBalanceSnapshot = {
    totalDeposit: newDeposit,
    savingsBalance: newSavings,
    dueAmount: newDue,
    profitBalance: newProfit,
  };

  // Generate Sequential adjustmentId (matching Screenshot 2: 130, 131, 132...)
  const lastRecord = await Adjustment.findOne().sort({ createdAt: -1 });
  let nextNumericId = 130;
  if (lastRecord && !isNaN(Number(lastRecord.adjustmentId))) {
    nextNumericId = Math.max(130, Number(lastRecord.adjustmentId) + 1);
  }
  const adjustmentId = String(nextNumericId);

  const docData: any = {
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

  if (userId && mongoose.isValidObjectId(userId)) {
    docData.createdBy = new mongoose.Types.ObjectId(userId);
  }

  // Execute with Session / Transaction if replica set is available, else fallback
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const adjustmentDoc = new Adjustment(docData);
    const createdAdjustment = await adjustmentDoc.save({ session });

    // Update member balances
    await Member.findByIdAndUpdate(
      member._id,
      {
        totalDeposit: newDeposit,
        savingsBalance: newSavings,
        dueAmount: newDue,
        profitBalance: newProfit,
      },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    return createdAdjustment;
  } catch (error: any) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }
    // If replica set is not configured (e.g. standalone Mongo dev), perform atomic direct operations
    if (error?.message?.includes("replica set") || error?.message?.includes("Transaction numbers")) {
      const adjustmentDoc = new Adjustment(docData);
      const createdAdjustment = await adjustmentDoc.save();

      await Member.findByIdAndUpdate(
        member._id,
        {
          totalDeposit: newDeposit,
          savingsBalance: newSavings,
          dueAmount: newDue,
          profitBalance: newProfit,
        },
        { runValidators: true }
      );

      return createdAdjustment;
    }
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

/**
 * 2. Get Filtered Adjustments with Date Range & Pagination
 */
const getAdjustmentsFromDB = async (filters: IAdjustmentFilterParams) => {
  const query: Record<string, any> = {};

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
    Adjustment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Adjustment.countDocuments(query),
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
const getSingleAdjustmentFromDB = async (id: string) => {
  const adjustment = await Adjustment.findOne({
    $or: [
      { adjustmentId: id },
      ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : []),
    ],
  }).populate("memberId", "fullName memberCode email mobileNo totalDeposit dueAmount savingsBalance");

  if (!adjustment) {
    throw new AppError(httpStatus.NOT_FOUND, "Adjustment record not found");
  }

  return adjustment;
};

export const AdjustmentServices = {
  createAdjustmentInDB,
  getAdjustmentsFromDB,
  getSingleAdjustmentFromDB,
};
