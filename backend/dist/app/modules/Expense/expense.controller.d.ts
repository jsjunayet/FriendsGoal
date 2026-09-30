import type { Request, Response } from "express";
export declare const ExpenseControllers: {
    createExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getExpenses: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllExpenseCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createExpenseCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    reorderExpenseCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteExpenseCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=expense.controller.d.ts.map