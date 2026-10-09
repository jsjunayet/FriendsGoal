import type { Model, Types } from "mongoose";
export interface IInvestmentIncome {
    _id?: Types.ObjectId | string;
    numericId?: number;
    investmentId: Types.ObjectId | string;
    investmentName: string;
    date: Date;
    amount: number;
    remarks: string;
    distributedToCount?: number;
    perMemberProfit?: number;
    createdBy?: Types.ObjectId | string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface InvestmentIncomeModel extends Model<IInvestmentIncome> {
    getNextNumericId(): Promise<number>;
}
//# sourceMappingURL=investmentIncome.interface.d.ts.map