import mongoose from "mongoose";
import { ICreateExpensePayload, IUpdateExpensePayload, IExpenseFilterQuery, ICreateCategoryPayload, IReorderCategoriesPayload } from "./expense.interface";
/**
 * 1. Create a new Expense
 */
declare const createExpenseInDB: (payload: ICreateExpensePayload, userId?: string) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpense, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpense & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 2. Get Expenses with Search & Pagination
 */
declare const getExpensesFromDB: (query: IExpenseFilterQuery) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("./expense.interface").IExpense & Required<{
        _id: string | mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
/**
 * 3. Get Single Expense by ID or ExpenseId
 */
declare const getSingleExpenseFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpense, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpense & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 4. Update Expense
 */
declare const updateExpenseInDB: (id: string, payload: IUpdateExpensePayload) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpense, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpense & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 5. Delete Expense (Soft-delete)
 */
declare const deleteExpenseFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpense, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpense & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 6. Get All Categories (ordered by sequence)
 */
declare const getAllExpenseCategoriesFromDB: () => Promise<(import("./expense.interface").IExpenseCategory & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
/**
 * 7. Create Category
 */
declare const createExpenseCategoryInDB: (payload: ICreateCategoryPayload) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpenseCategory, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpenseCategory & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 8. Reorder Categories
 */
declare const reorderExpenseCategoriesInDB: (payload: IReorderCategoriesPayload) => Promise<(import("./expense.interface").IExpenseCategory & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
/**
 * 9. Delete Category
 */
declare const deleteExpenseCategoryFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./expense.interface").IExpenseCategory, {}, mongoose.DefaultSchemaOptions> & import("./expense.interface").IExpenseCategory & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const ExpenseServices: {
    createExpenseInDB: typeof createExpenseInDB;
    getExpensesFromDB: typeof getExpensesFromDB;
    getSingleExpenseFromDB: typeof getSingleExpenseFromDB;
    updateExpenseInDB: typeof updateExpenseInDB;
    deleteExpenseFromDB: typeof deleteExpenseFromDB;
    getAllExpenseCategoriesFromDB: typeof getAllExpenseCategoriesFromDB;
    createExpenseCategoryInDB: typeof createExpenseCategoryInDB;
    reorderExpenseCategoriesInDB: typeof reorderExpenseCategoriesInDB;
    deleteExpenseCategoryFromDB: typeof deleteExpenseCategoryFromDB;
};
export {};
//# sourceMappingURL=expense.service.d.ts.map