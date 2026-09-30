import type { Model, Types } from "mongoose";
export interface IExpenseCategory {
    _id?: Types.ObjectId | string;
    name: string;
    order: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type ExpenseCategoryModel = Model<IExpenseCategory>;
export interface IExpense {
    _id?: Types.ObjectId | string;
    expenseId: number;
    memberId?: Types.ObjectId | string;
    memberName: string;
    memberCode?: string;
    expenseHead: string;
    expenseCategoryId?: Types.ObjectId | string;
    expenseDate: Date;
    amount: number;
    remarks: string;
    voucherNo?: string;
    createdBy?: Types.ObjectId | string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ExpenseModel extends Model<IExpense> {
    getNextExpenseId(): Promise<number>;
}
export interface ICreateExpensePayload {
    expenseHead: string;
    memberId?: string;
    memberName?: string;
    memberCode?: string;
    expenseDate: string | Date;
    amount: number;
    remarks: string;
}
export interface IUpdateExpensePayload {
    expenseHead?: string;
    memberId?: string;
    memberName?: string;
    memberCode?: string;
    expenseDate?: string | Date;
    amount?: number;
    remarks?: string;
}
export interface IExpenseFilterQuery {
    search?: string;
    page?: string | number;
    limit?: string | number;
    fromDate?: string;
    toDate?: string;
    expenseHead?: string;
}
export interface ICreateCategoryPayload {
    name: string;
    order?: number;
}
export interface IReorderItem {
    id: string;
    order: number;
}
export interface IReorderCategoriesPayload {
    categories: IReorderItem[];
}
//# sourceMappingURL=expense.interface.d.ts.map