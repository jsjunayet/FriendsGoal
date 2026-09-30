import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Investment } from "./investment.model";
import { Member } from "../Member/member.model";
import {
  ICreateInvestmentPayload,
  IUpdateInvestmentPayload,
  IInvestmentFilterQuery,
} from "./investment.interface";

// ─── Default seed investments matching Screenshot 1 ───────────────────────────
const DEFAULT_INVESTMENTS = [
  {
    investmentId: "001",
    numericId: 1,
    name: "The Barik Brother's",
    startDate: new Date("2025-01-05"),
    endDate: new Date("2026-03-09"),
    amount: 500000,
    remarks: "Business Development",
    status: "Closed" as const,
    isActive: false,
    isDeleted: false,
  },
  {
    investmentId: "002",
    numericId: 2,
    name: "WIN Homes Limited (Land Share)",
    startDate: new Date("2025-06-24"),
    endDate: new Date("2025-12-23"),
    amount: 1350000,
    remarks: "First 200000 and second 1000000...",
    status: "Closed" as const,
    isActive: false,
    isDeleted: false,
  },
  {
    investmentId: "003",
    numericId: 3,
    name: "WIN Homes Limited (Land Share 2)",
    startDate: new Date("2025-12-25"),
    endDate: new Date("2026-05-03"),
    amount: 1200000,
    remarks: "1200000tk Transfer from Previous...",
    status: "Closed" as const,
    isActive: false,
    isDeleted: false,
  },
  {
    investmentId: "004",
    numericId: 4,
    name: "WIN Homes Limited (3nos Share)",
    startDate: new Date("2026-05-07"),
    endDate: null,
    amount: 1350000,
    remarks: "C.S.A&C.A 139, R.S 683, DHAKA 41<",
    status: "Running" as const,
    isActive: true,
    isDeleted: false,
  },
];

/**
 * 1. Create a new Investment
 * - Financial Accounting Rule: Selecting member is ONLY for tracking; NEVER alters member ledger.
 * - Initial state: status defaults to 'Running', isActive to true, endDate null.
 */
const createInvestmentInDB = async (
  payload: ICreateInvestmentPayload,
  userId?: string
) => {
  try {
    await Investment.collection.dropIndex("id_1");
  } catch {
    // Legacy index already dropped
  }

  let memberName = payload.memberName;
  let memberCode = payload.memberCode;

  if (payload.memberId && mongoose.isValidObjectId(payload.memberId)) {
    const member = await Member.findById(payload.memberId);
    if (member) {
      memberName = member.fullName;
      memberCode = member.memberCode;
    }
  }

  const { investmentId, numericId } = await Investment.getNextInvestmentId();

  const isClosedExplicitly = payload.status === "Closed" || Boolean(payload.endDate);
  const status = isClosedExplicitly ? "Closed" : "Running";
  const isActive = isClosedExplicitly ? false : (payload.isActive ?? true);
  const endDate = payload.endDate ? new Date(payload.endDate) : null;

  const docData: any = {
    investmentId,
    numericId,
    name: payload.name.trim(),
    amount: Number(payload.amount),
    startDate: new Date(payload.startDate),
    endDate,
    remarks: payload.remarks.trim(),
    status,
    isActive,
    memberId: payload.memberId && mongoose.isValidObjectId(payload.memberId)
      ? new mongoose.Types.ObjectId(payload.memberId)
      : undefined,
    memberName: memberName ? memberName.trim() : undefined,
    memberCode: memberCode ? memberCode.trim() : undefined,
    isDeleted: false,
  };

  if (userId && mongoose.isValidObjectId(userId)) {
    docData.createdBy = new mongoose.Types.ObjectId(userId);
  }

  const createdInvestment = await Investment.create(docData);
  return createdInvestment;
};

/**
 * 2. Get All Investments with Search & Filter
 */
const getInvestmentsFromDB = async (query: IInvestmentFilterQuery) => {
  // Ensure default seed data exists if DB is empty
  const count = await Investment.countDocuments({ isDeleted: false });
  if (count === 0) {
    await Investment.insertMany(DEFAULT_INVESTMENTS).catch(() => {});
  }

  const filter: Record<string, any> = { isDeleted: false };

  // Search filter
  if (query.search && query.search.trim()) {
    const term = query.search.trim();
    const isNum = !isNaN(Number(term));

    const orConditions: any[] = [
      { name: { $regex: term, $options: "i" } },
      { remarks: { $regex: term, $options: "i" } },
      { investmentId: { $regex: term, $options: "i" } },
      { memberName: { $regex: term, $options: "i" } },
      { status: { $regex: term, $options: "i" } },
    ];

    if (isNum) {
      orConditions.push({ amount: Number(term) });
      orConditions.push({ numericId: Number(term) });
    }

    filter.$or = orConditions;
  }

  // Status filter
  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }

  // Active status filter
  if (query.isActive !== undefined && query.isActive !== "") {
    filter.isActive = query.isActive === "true";
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Investment.find(filter)
      .sort({ numericId: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Investment.countDocuments(filter),
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
 * 3. Get Single Investment by ID
 */
const getSingleInvestmentFromDB = async (id: string) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else {
    query.investmentId = id;
  }

  const investment = await Investment.findOne(query);
  if (!investment) {
    throw new AppError(httpStatus.NOT_FOUND, "Investment record not found");
  }
  return investment;
};

/**
 * 4. Close an active Investment
 * - Sets endDate to today (Date.now())
 * - Updates status from 'Running' to 'Closed'
 * - Updates isActive from true to false
 * - DOES NOT modify member balances
 */
const closeInvestmentInDB = async (id: string) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else {
    query.investmentId = id;
  }

  const existing = await Investment.findOne(query);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Investment record not found to close");
  }

  const updated = await Investment.findOneAndUpdate(
    query,
    {
      endDate: new Date(),
      status: "Closed",
      isActive: false,
    },
    { new: true, runValidators: true }
  );

  return updated;
};

/**
 * 5. Update Investment
 */
const updateInvestmentInDB = async (id: string, payload: IUpdateInvestmentPayload) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else {
    query.investmentId = id;
  }

  const updateData: any = { ...payload };
  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate !== undefined) {
    updateData.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  if (payload.amount !== undefined) {
    updateData.amount = Number(payload.amount);
  }
  if (payload.status) {
    updateData.isActive = payload.status === "Running";
  }

  const updated = await Investment.findOneAndUpdate(query, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Investment record not found to update");
  }

  return updated;
};

/**
 * 6. Delete Investment (Soft delete)
 */
const deleteInvestmentFromDB = async (id: string) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else {
    query.investmentId = id;
  }

  const deleted = await Investment.findOneAndUpdate(
    query,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Investment record not found to delete");
  }

  return deleted;
};

export const InvestmentServices = {
  createInvestmentInDB,
  getInvestmentsFromDB,
  getSingleInvestmentFromDB,
  closeInvestmentInDB,
  updateInvestmentInDB,
  deleteInvestmentFromDB,
};
