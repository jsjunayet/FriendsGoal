"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const expense_model_1 = require("./expense.model");
const member_model_1 = require("../Member/member.model");
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
// ─── Default seed expenses matching Screenshot 1 ──────────────────────────────
const DEFAULT_EXPENSES = [
    {
        expenseId: 1,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Software Cost",
        expenseDate: new Date("2025-10-22"),
        amount: 60000.0,
        remarks: "FG Website and ERP Software Development",
        voucherNo: "EXP-00001",
    },
    {
        expenseId: 2,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-07"),
        amount: 4200.0,
        remarks: "Letter Head(120gms)",
        voucherNo: "EXP-00002",
    },
    {
        expenseId: 3,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-07"),
        amount: 3200.0,
        remarks: "Money Receipt(1000pcs)",
        voucherNo: "EXP-00003",
    },
    {
        expenseId: 4,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-07"),
        amount: 420.0,
        remarks: "Auto Round Seal",
        voucherNo: "EXP-00004",
    },
    {
        expenseId: 5,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-07"),
        amount: 840.0,
        remarks: "Auto Seal 3Pcs",
        voucherNo: "EXP-00005",
    },
    {
        expenseId: 6,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-24"),
        amount: 330.0,
        remarks: "Stamp(100tk) 3pcs",
        voucherNo: "EXP-00006",
    },
    {
        expenseId: 7,
        memberName: "MD. JUWEL HASAN",
        expenseHead: "Office Goods",
        expenseDate: new Date("2024-09-24"),
        amount: 1230.0,
        remarks: "Stamp Cartige 41pcs",
        voucherNo: "EXP-00007",
    },
];
/**
 * 1. Create a new Expense
 */
const createExpenseInDB = async (payload, userId) => {
    let memberName = payload.memberName || "General Member";
    let memberCode = payload.memberCode;
    // If memberId is provided, pull member details
    if (payload.memberId && mongoose_1.default.isValidObjectId(payload.memberId)) {
        const member = await member_model_1.Member.findById(payload.memberId);
        if (member) {
            memberName = member.fullName;
            memberCode = member.memberCode;
        }
    }
    // Find or link category if exists
    let expenseCategoryId;
    const category = await expense_model_1.ExpenseCategory.findOne({
        name: { $regex: new RegExp(`^${payload.expenseHead.trim()}$`, "i") },
        isDeleted: false,
    });
    if (category) {
        expenseCategoryId = category._id;
    }
    const nextExpenseId = await expense_model_1.Expense.getNextExpenseId();
    const voucherNo = `EXP-${String(nextExpenseId).padStart(5, "0")}`;
    const expenseData = {
        expenseId: nextExpenseId,
        memberId: payload.memberId && mongoose_1.default.isValidObjectId(payload.memberId)
            ? new mongoose_1.default.Types.ObjectId(payload.memberId)
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
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        expenseData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    const createdExpense = await expense_model_1.Expense.create(expenseData);
    return createdExpense;
};
/**
 * 2. Get Expenses with Search & Pagination
 */
const getExpensesFromDB = async (query) => {
    // Ensure default seed data exists if DB is empty
    const count = await expense_model_1.Expense.countDocuments({ isDeleted: false });
    if (count === 0) {
        await expense_model_1.Expense.insertMany(DEFAULT_EXPENSES).catch(() => { });
    }
    const filter = { isDeleted: false };
    // Search filter (Search For...)
    if (query.search && query.search.trim()) {
        const searchTerm = query.search.trim();
        const isNum = !isNaN(Number(searchTerm));
        const orConditions = [
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
        expense_model_1.Expense.find(filter)
            .sort({ expenseId: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        expense_model_1.Expense.countDocuments(filter),
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
const getSingleExpenseFromDB = async (id) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else if (!isNaN(Number(id))) {
        query.expenseId = Number(id);
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid expense identifier");
    }
    const expense = await expense_model_1.Expense.findOne(query);
    if (!expense) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Expense record not found");
    }
    return expense;
};
/**
 * 4. Update Expense
 */
const updateExpenseInDB = async (id, payload) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else if (!isNaN(Number(id))) {
        query.expenseId = Number(id);
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid expense identifier");
    }
    const updateData = { ...payload };
    if (payload.expenseDate) {
        updateData.expenseDate = new Date(payload.expenseDate);
    }
    if (payload.amount !== undefined) {
        updateData.amount = Number(payload.amount);
    }
    const updatedExpense = await expense_model_1.Expense.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updatedExpense) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Expense record not found to update");
    }
    return updatedExpense;
};
/**
 * 5. Delete Expense (Soft-delete)
 */
const deleteExpenseFromDB = async (id) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else if (!isNaN(Number(id))) {
        query.expenseId = Number(id);
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid expense identifier");
    }
    const deletedExpense = await expense_model_1.Expense.findOneAndUpdate(query, { isDeleted: true }, { new: true });
    if (!deletedExpense) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Expense record not found to delete");
    }
    return deletedExpense;
};
/**
 * 6. Get All Categories (ordered by sequence)
 */
const getAllExpenseCategoriesFromDB = async () => {
    // Ensure default categories exist if collection is empty
    const count = await expense_model_1.ExpenseCategory.countDocuments({ isDeleted: false });
    if (count === 0) {
        await expense_model_1.ExpenseCategory.insertMany(DEFAULT_CATEGORIES).catch(() => { });
    }
    const categories = await expense_model_1.ExpenseCategory.find({ isDeleted: false })
        .sort({ order: 1, createdAt: 1 })
        .lean();
    return categories;
};
/**
 * 7. Create Category
 */
const createExpenseCategoryInDB = async (payload) => {
    const name = payload.name.trim();
    // Check if exists
    const existing = await expense_model_1.ExpenseCategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        isDeleted: false,
    });
    if (existing) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Category already exists");
    }
    // Calculate next order if not provided
    let order = payload.order;
    if (order === undefined || isNaN(order)) {
        const highest = await expense_model_1.ExpenseCategory.findOne({ isDeleted: false })
            .sort({ order: -1 })
            .lean();
        order = highest && typeof highest.order === "number" ? highest.order + 1 : 0;
    }
    const category = await expense_model_1.ExpenseCategory.create({
        name,
        order,
        isDeleted: false,
    });
    return category;
};
/**
 * 8. Reorder Categories
 */
const reorderExpenseCategoriesInDB = async (payload) => {
    const { categories } = payload;
    const updatePromises = categories.map((cat) => {
        if (mongoose_1.default.isValidObjectId(cat.id)) {
            return expense_model_1.ExpenseCategory.findByIdAndUpdate(cat.id, { order: cat.order });
        }
        return Promise.resolve(null);
    });
    await Promise.all(updatePromises);
    // Return updated list
    return expense_model_1.ExpenseCategory.find({ isDeleted: false })
        .sort({ order: 1, createdAt: 1 })
        .lean();
};
/**
 * 9. Delete Category
 */
const deleteExpenseCategoryFromDB = async (id) => {
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid category ID");
    }
    const deleted = await expense_model_1.ExpenseCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return deleted;
};
exports.ExpenseServices = {
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
//# sourceMappingURL=expense.service.js.map