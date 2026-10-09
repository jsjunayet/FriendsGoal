import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Disbursement } from "./disbursement.model";
import { Member } from "../Member/member.model";
import {
  ICreateDisbursementPayload,
  IDisbursementFilterQuery,
} from "./disbursement.interface";
import { AuditLogServices } from "../AuditLog/auditLog.service";

/**
 * 1. Fetch active member profitBalance
 */
const getMemberProfitBalanceFromDB = async (memberId: string) => {
  let member = null;
  if (mongoose.isValidObjectId(memberId)) {
    member = await Member.findOne({ _id: memberId, isDeleted: false });
  }

  if (!member) {
    const cleanId = decodeURIComponent(memberId).trim();
    member = await Member.findOne({
      isDeleted: false,
      $or: [
        { memberCode: cleanId },
        { email: cleanId },
        { fullName: { $regex: new RegExp(`^${cleanId}$`, "i") } },
      ],
    });
  }

  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Member record not found");
  }

  const rawProfit = (member as any).profitBalance;
  const profitBalance =
    rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;

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
const createDisbursementInDB = async (
  payload: ICreateDisbursementPayload,
  userId?: string
) => {
  const { memberId, paidAmount, disbursDate, remarks } = payload;
  const amount = Number(paidAmount);

  if (isNaN(amount) || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Paid amount must be a positive number"
    );
  }

  let member = null;
  if (mongoose.isValidObjectId(memberId)) {
    member = await Member.findOne({ _id: memberId, isDeleted: false });
  }

  if (!member) {
    const cleanId = decodeURIComponent(memberId).trim();
    member = await Member.findOne({
      isDeleted: false,
      $or: [
        { memberCode: cleanId },
        { email: cleanId },
        { fullName: { $regex: new RegExp(`^${cleanId}$`, "i") } },
      ],
    });
  }

  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Active member record not found");
  }

  const rawProfit = (member as any).profitBalance;
  const currentProfit =
    rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;

  if (amount > currentProfit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Paid amount (৳${amount}) exceeds available profit balance (৳${currentProfit})`
    );
  }

  const { disbursementId, numericId } =
    await Disbursement.getNextDisbursementId();

  const docData: any = {
    disbursementId,
    numericId,
    memberId: member._id,
    memberName: member.fullName,
    memberCode: member.memberCode,
    disbursedAmount: amount,
    disbursDate: disbursDate ? new Date(disbursDate) : new Date(),
    remarks: remarks || "Profit Disbursement Payout - Merged into Deposit",
  };

  if (userId && mongoose.isValidObjectId(userId)) {
    docData.createdBy = new mongoose.Types.ObjectId(userId);
  }

  // Attempt Transaction with Session
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const disbursementDoc = new Disbursement(docData);
    const createdDisbursement = await disbursementDoc.save({ session });

    // Deduct profit balance atomically and merge directly into totalDeposit!
    await Member.findByIdAndUpdate(
      member._id,
      {
        $inc: { profitBalance: -amount, totalDeposit: amount },
      },
      { session, runValidators: true }
    );

    await session.commitTransaction();

    await AuditLogServices.createAuditLogInDB({
      adminName: "Super Admin",
      adminRole: "Super Admin",
      action: "Amount Modified",
      target: `${member.fullName} (${member.memberCode})`,
      details: `Profit disbursement payout of ৳${amount.toLocaleString()} paid to ${member.fullName} and merged into Total Deposit.`,
    }).catch((err) => console.error("Failed to record disbursement audit log:", err));

    return createdDisbursement;
  } catch (error: any) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }

    // Fallback for standalone Mongo environments without replica set
    if (
      error?.message?.includes("replica set") ||
      error?.message?.includes("Transaction numbers")
    ) {
      const disbursementDoc = new Disbursement(docData);
      const createdDisbursement = await disbursementDoc.save();

      // Deduct profit balance atomically and merge directly into totalDeposit!
      await Member.findByIdAndUpdate(member._id, {
        $inc: { profitBalance: -amount, totalDeposit: amount },
      });

      await AuditLogServices.createAuditLogInDB({
        adminName: "Super Admin",
        adminRole: "Super Admin",
        action: "Amount Modified",
        target: `${member.fullName} (${member.memberCode})`,
        details: `Profit disbursement payout of ৳${amount.toLocaleString()} paid to ${member.fullName} and merged into Total Deposit.`,
      }).catch((err) => console.error("Failed to record disbursement audit log:", err));

      return createdDisbursement;
    }

    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

/**
 * 3. Fetch Payout Audit List with Date Filtering & Search
 */
const getDisbursementsFromDB = async (filters: IDisbursementFilterQuery) => {
  const query: Record<string, any> = {};

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
    if (mongoose.isValidObjectId(filters.memberId)) {
      query.memberId = filters.memberId;
    }
  }

  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim();
    const isNum = !isNaN(Number(term));

    const orConditions: any[] = [
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
    Disbursement.find(query)
      .sort({ numericId: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Disbursement.countDocuments(query),
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

export const DisbursementServices = {
  getMemberProfitBalanceFromDB,
  createDisbursementInDB,
  getDisbursementsFromDB,
};
