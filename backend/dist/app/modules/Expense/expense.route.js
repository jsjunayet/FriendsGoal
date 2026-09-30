"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryRoutes = exports.ExpenseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const expense_controller_1 = require("./expense.controller");
const expense_validation_1 = require("./expense.validation");
const expenseRouter = express_1.default.Router();
const expenseCategoryRouter = express_1.default.Router();
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Expense Routes (/api/v1/expenses)
 * ─────────────────────────────────────────────────────────────────────────────
 */
// 1. GET /api/v1/expenses -> Get paginated expenses list with search query parameter (?search=)
expenseRouter.get("/", expense_controller_1.ExpenseControllers.getExpenses);
// 2. POST /api/v1/expenses -> Save new expense entry
expenseRouter.post("/", (0, validateRequest_1.default)(expense_validation_1.ExpenseValidation.createExpenseValidationSchema), expense_controller_1.ExpenseControllers.createExpense);
// 3. GET /api/v1/expenses/:id -> Get single expense details
expenseRouter.get("/:id", expense_controller_1.ExpenseControllers.getSingleExpense);
// 4. PATCH /api/v1/expenses/:id -> Update expense
expenseRouter.patch("/:id", (0, validateRequest_1.default)(expense_validation_1.ExpenseValidation.updateExpenseValidationSchema), expense_controller_1.ExpenseControllers.updateExpense);
// 5. DELETE /api/v1/expenses/:id -> Delete expense
expenseRouter.delete("/:id", expense_controller_1.ExpenseControllers.deleteExpense);
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Expense Category Routes (/api/v1/expense-categories)
 * ─────────────────────────────────────────────────────────────────────────────
 */
// 1. GET /api/v1/expense-categories -> Fetch all expense categories ordered by drag sequence
expenseCategoryRouter.get("/", expense_controller_1.ExpenseControllers.getAllExpenseCategories);
// 2. POST /api/v1/expense-categories -> Add a new expense head category
expenseCategoryRouter.post("/", (0, validateRequest_1.default)(expense_validation_1.ExpenseValidation.createCategoryValidationSchema), expense_controller_1.ExpenseControllers.createExpenseCategory);
// 3. PATCH /api/v1/expense-categories/reorder -> Update category display order
expenseCategoryRouter.patch("/reorder", (0, validateRequest_1.default)(expense_validation_1.ExpenseValidation.reorderCategoriesValidationSchema), expense_controller_1.ExpenseControllers.reorderExpenseCategories);
// 4. DELETE /api/v1/expense-categories/:id -> Remove category
expenseCategoryRouter.delete("/:id", expense_controller_1.ExpenseControllers.deleteExpenseCategory);
exports.ExpenseRoutes = expenseRouter;
exports.ExpenseCategoryRoutes = expenseCategoryRouter;
//# sourceMappingURL=expense.route.js.map