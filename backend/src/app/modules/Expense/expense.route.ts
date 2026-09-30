import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ExpenseControllers } from "./expense.controller";
import { ExpenseValidation } from "./expense.validation";

const expenseRouter = express.Router();
const expenseCategoryRouter = express.Router();

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Expense Routes (/api/v1/expenses)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 1. GET /api/v1/expenses -> Get paginated expenses list with search query parameter (?search=)
expenseRouter.get("/", ExpenseControllers.getExpenses);

// 2. POST /api/v1/expenses -> Save new expense entry
expenseRouter.post(
  "/",
  validateRequest(ExpenseValidation.createExpenseValidationSchema),
  ExpenseControllers.createExpense
);

// 3. GET /api/v1/expenses/:id -> Get single expense details
expenseRouter.get("/:id", ExpenseControllers.getSingleExpense);

// 4. PATCH /api/v1/expenses/:id -> Update expense
expenseRouter.patch(
  "/:id",
  validateRequest(ExpenseValidation.updateExpenseValidationSchema),
  ExpenseControllers.updateExpense
);

// 5. DELETE /api/v1/expenses/:id -> Delete expense
expenseRouter.delete("/:id", ExpenseControllers.deleteExpense);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Expense Category Routes (/api/v1/expense-categories)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 1. GET /api/v1/expense-categories -> Fetch all expense categories ordered by drag sequence
expenseCategoryRouter.get("/", ExpenseControllers.getAllExpenseCategories);

// 2. POST /api/v1/expense-categories -> Add a new expense head category
expenseCategoryRouter.post(
  "/",
  validateRequest(ExpenseValidation.createCategoryValidationSchema),
  ExpenseControllers.createExpenseCategory
);

// 3. PATCH /api/v1/expense-categories/reorder -> Update category display order
expenseCategoryRouter.patch(
  "/reorder",
  validateRequest(ExpenseValidation.reorderCategoriesValidationSchema),
  ExpenseControllers.reorderExpenseCategories
);

// 4. DELETE /api/v1/expense-categories/:id -> Remove category
expenseCategoryRouter.delete("/:id", ExpenseControllers.deleteExpenseCategory);

export const ExpenseRoutes = expenseRouter;
export const ExpenseCategoryRoutes = expenseCategoryRouter;
