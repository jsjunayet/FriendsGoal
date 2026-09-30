"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const expense_service_1 = require("./expense.service");
// 1. Create Expense
const createExpense = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const result = await expense_service_1.ExpenseServices.createExpenseInDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Expense created successfully!",
        data: result,
    });
});
// 2. Get Expenses (with Search, Head Filter & Pagination)
const getExpenses = (0, catchAsync_1.default)(async (req, res) => {
    const result = await expense_service_1.ExpenseServices.getExpensesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expenses retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
// 3. Get Single Expense
const getSingleExpense = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await expense_service_1.ExpenseServices.getSingleExpenseFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense retrieved successfully!",
        data: result,
    });
});
// 4. Update Expense
const updateExpense = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await expense_service_1.ExpenseServices.updateExpenseInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense updated successfully!",
        data: result,
    });
});
// 5. Delete Expense
const deleteExpense = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await expense_service_1.ExpenseServices.deleteExpenseFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense deleted successfully!",
        data: result,
    });
});
// 6. Get All Expense Categories
const getAllExpenseCategories = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await expense_service_1.ExpenseServices.getAllExpenseCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense categories retrieved successfully!",
        data: result,
    });
});
// 7. Create Expense Category
const createExpenseCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await expense_service_1.ExpenseServices.createExpenseCategoryInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Expense category created successfully!",
        data: result,
    });
});
// 8. Reorder Expense Categories
const reorderExpenseCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await expense_service_1.ExpenseServices.reorderExpenseCategoriesInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense categories reordered successfully!",
        data: result,
    });
});
// 9. Delete Expense Category
const deleteExpenseCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await expense_service_1.ExpenseServices.deleteExpenseCategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expense category deleted successfully!",
        data: result,
    });
});
exports.ExpenseControllers = {
    createExpense,
    getExpenses,
    getSingleExpense,
    updateExpense,
    deleteExpense,
    getAllExpenseCategories,
    createExpenseCategory,
    reorderExpenseCategories,
    deleteExpenseCategory,
};
//# sourceMappingURL=expense.controller.js.map