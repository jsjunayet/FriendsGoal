import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExpenseServices } from "./expense.service";

// 1. Create Expense
const createExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await ExpenseServices.createExpenseInDB(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expense created successfully!",
    data: result,
  });
});

// 2. Get Expenses (with Search, Head Filter & Pagination)
const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseServices.getExpensesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expenses retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 3. Get Single Expense
const getSingleExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ExpenseServices.getSingleExpenseFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense retrieved successfully!",
    data: result,
  });
});

// 4. Update Expense
const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ExpenseServices.updateExpenseInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense updated successfully!",
    data: result,
  });
});

// 5. Delete Expense
const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ExpenseServices.deleteExpenseFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense deleted successfully!",
    data: result,
  });
});

// 6. Get All Expense Categories
const getAllExpenseCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await ExpenseServices.getAllExpenseCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense categories retrieved successfully!",
    data: result,
  });
});

// 7. Create Expense Category
const createExpenseCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseServices.createExpenseCategoryInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expense category created successfully!",
    data: result,
  });
});

// 8. Reorder Expense Categories
const reorderExpenseCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseServices.reorderExpenseCategoriesInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense categories reordered successfully!",
    data: result,
  });
});

// 9. Delete Expense Category
const deleteExpenseCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ExpenseServices.deleteExpenseCategoryFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense category deleted successfully!",
    data: result,
  });
});

export const ExpenseControllers = {
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
