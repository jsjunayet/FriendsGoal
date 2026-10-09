import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Expense, ExpenseCategory } from "./expense.model";
import { Member } from "../Member/member.model";
import {
  ICreateExpensePayload,
  IUpdateExpensePayload,
  IExpenseFilterQuery,
  ICreateCategoryPayload,
  IReorderCategoriesPayload,
} from "./expense.interface";
import { AuditLogServices } from "../AuditLog/auditLog.service";

// ─── Default seed categories matching Screenshot 3 ────────────────────────────
const DEFAULT_CATEGORIES = [
  { name: "Software Cost", order: 0 },
  { name: "Office Goods", order: 1 },
  { name: "Travel", order: 2 },
  { name: "Salary", order: 3 },
  { name: "Advertising", order: 4 },
  { name: "Tax & Compliance", order: 5 },
  { name: "Utilities", order: 6 },
  { name: "Training", order: 7 },
];

/**
 * 1. Create a new Expense
 */
const createExpenseInDB = async (
  payload: ICreateExpensePayload,
  userId?: string
) => {
  let memberName = payload.memberName || "General Member";
  let memberCode = payload.memberCode;

  // If memberId is provided, pull member details
  if (payload.memberId && mongoose.isValidObjectId(payload.memberId)) {
    const member = await Member.findById(payload.memberId);
    if (member) {
      memberName = member.fullName;
      memberCode = member.memberCode;
    }
  }

  // Find or link category if exists
  let expenseCategoryId: mongoose.Types.ObjectId | undefined;
  const category = await ExpenseCategory.findOne({
    name: { $regex: new RegExp(`^${payload.expenseHead.trim()}$`, "i") },
    isDeleted: false,
  });
  if (category) {
    expenseCategoryId = category._id as mongoose.Types.ObjectId;
  }

  const nextExpenseId = await Expense.getNextExpenseId();
  const voucherNo = `EXP-${String(nextExpenseId).padStart(5, "0")}`;

  const expenseData: any = {
    expenseId: nextExpenseId,
    memberId: payload.memberId && mongoose.isValidObjectId(payload.memberId)
      ? new mongoose.Types.ObjectId(payload.memberId)
      : undefined,
    memberName: memberName.trim(),
    memberCode: memberCode ? memberCode.trim() : undefined,
    expenseHead: payload.expenseHead.trim(),
    expenseCategoryId,
    expenseDate: new Date(payload.expenseDate),
    amount: Number(payload.amount),
    remarks: payload.remarks.trim(),
    voucherNo,
    isDeleted: false,
  };

  if (userId && mongoose.isValidObjectId(userId)) {
    expenseData.createdBy = new mongoose.Types.ObjectId(userId);
  }

  const createdExpense = await Expense.create(expenseData);

  // Record Audit Log
  await AuditLogServices.createAuditLogInDB({
    adminName: "Super Admin",
    adminRole: "Super Admin",
    action: "Amount Modified",
    target: `${payload.expenseHead}`,
    details: `Expense voucher ${voucherNo} of ৳${Number(payload.amount).toLocaleString()} recorded for ${payload.expenseHead}.`,
  }).catch((err) => console.error("Failed to record expense audit log:", err));

  return createdExpense;
};

/**
 * 2. Get Expenses with Search & Pagination
 */
const getExpensesFromDB = async (query: IExpenseFilterQuery) => {
  const filter: Record<string, any> = { isDeleted: false };

  // Search filter (Search For...)
  if (query.search && query.search.trim()) {
    const searchTerm = query.search.trim();
    const isNum = !isNaN(Number(searchTerm));

    const orConditions: any[] = [
      { memberName: { $regex: searchTerm, $options: "i" } },
      { expenseHead: { $regex: searchTerm, $options: "i" } },
      { remarks: { $regex: searchTerm, $options: "i" } },
      { memberCode: { $regex: searchTerm, $options: "i" } },
      { voucherNo: { $regex: searchTerm, $options: "i" } },
    ];

    if (isNum) {
      orConditions.push({ expenseId: Number(searchTerm) });
      orConditions.push({ amount: Number(searchTerm) });
    }

    filter.$or = orConditions;
  }

  // Expense Head filter
  if (query.expenseHead && query.expenseHead !== "All") {
    filter.expenseHead = query.expenseHead;
  }

  // Date Range Filtering
  if (query.fromDate || query.toDate) {
    filter.expenseDate = {};
    if (query.fromDate) {
      filter.expenseDate.$gte = new Date(query.fromDate);
    }
    if (query.toDate) {
      const endOfDay = new Date(query.toDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.expenseDate.$lte = endOfDay;
    }
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Expense.find(filter)
      .sort({ expenseId: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Expense.countDocuments(filter),
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
 * 3. Get Single Expense by ID or ExpenseId
 */
const getSingleExpenseFromDB = async (id: string) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else if (!isNaN(Number(id))) {
    query.expenseId = Number(id);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid expense identifier");
  }

  const expense = await Expense.findOne(query);
  if (!expense) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense record not found");
  }
  return expense;
};

/**
 * 4. Update Expense
 */
const updateExpenseInDB = async (id: string, payload: IUpdateExpensePayload) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else if (!isNaN(Number(id))) {
    query.expenseId = Number(id);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid expense identifier");
  }

  const updateData: any = { ...payload };
  if (payload.expenseDate) {
    updateData.expenseDate = new Date(payload.expenseDate);
  }
  if (payload.amount !== undefined) {
    updateData.amount = Number(payload.amount);
  }

  const updatedExpense = await Expense.findOneAndUpdate(query, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedExpense) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense record not found to update");
  }

  return updatedExpense;
};

/**
 * 5. Delete Expense (Soft-delete)
 */
const deleteExpenseFromDB = async (id: string) => {
  const query: Record<string, any> = { isDeleted: false };
  if (mongoose.isValidObjectId(id)) {
    query._id = id;
  } else if (!isNaN(Number(id))) {
    query.expenseId = Number(id);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid expense identifier");
  }

  const deletedExpense = await Expense.findOneAndUpdate(
    query,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedExpense) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense record not found to delete");
  }

  return deletedExpense;
};

/**
 * 6. Get All Categories (ordered by sequence)
 */
const getAllExpenseCategoriesFromDB = async () => {
  // Ensure default categories exist if collection is empty
  const count = await ExpenseCategory.countDocuments({ isDeleted: false });
  if (count === 0) {
    await ExpenseCategory.insertMany(DEFAULT_CATEGORIES).catch(() => {});
  }

  const categories = await ExpenseCategory.find({ isDeleted: false })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return categories;
};

/**
 * 7. Create Category
 */
const createExpenseCategoryInDB = async (payload: ICreateCategoryPayload) => {
  const name = payload.name.trim();

  // Check if exists
  const existing = await ExpenseCategory.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
    isDeleted: false,
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  // Calculate next order if not provided
  let order = payload.order;
  if (order === undefined || isNaN(order)) {
    const highest = await ExpenseCategory.findOne({ isDeleted: false })
      .sort({ order: -1 })
      .lean();
    order = highest && typeof highest.order === "number" ? highest.order + 1 : 0;
  }

  const category = await ExpenseCategory.create({
    name,
    order,
    isDeleted: false,
  });

  return category;
};

/**
 * 8. Reorder Categories
 */
const reorderExpenseCategoriesInDB = async (payload: IReorderCategoriesPayload) => {
  const { categories } = payload;

  const updatePromises = categories.map((cat) => {
    if (mongoose.isValidObjectId(cat.id)) {
      return ExpenseCategory.findByIdAndUpdate(cat.id, { order: cat.order });
    }
    return Promise.resolve(null);
  });

  await Promise.all(updatePromises);

  // Return updated list
  return ExpenseCategory.find({ isDeleted: false })
    .sort({ order: 1, createdAt: 1 })
    .lean();
};

/**
 * 9. Delete Category
 */
const deleteExpenseCategoryFromDB = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid category ID");
  }

  const deleted = await ExpenseCategory.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return deleted;
};

export const ExpenseServices = {
  createExpenseInDB,
  getExpensesFromDB,
  getSingleExpenseFromDB,
  updateExpenseInDB,
  deleteExpenseFromDB,
  getAllExpenseCategoriesFromDB,
  createExpenseCategoryInDB,
  reorderExpenseCategoriesInDB,
  deleteExpenseCategoryFromDB,
};
