import type { Model, Types } from "mongoose";
export type TInvestmentStatus = "Running" | "Closed";
export interface IInvestment {
    _id?: Types.ObjectId | string;
    investmentId: string;
    numericId: number;
    name: string;
    amount: number;
    startDate: Date;
    endDate?: Date | null;
    remarks: string;
    status: TInvestmentStatus;
    isActive: boolean;
    memberId?: Types.ObjectId | string;
    memberName?: string;
    memberCode?: string;
    createdBy?: Types.ObjectId | string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface InvestmentModel extends Model<IInvestment> {
    getNextInvestmentId(): Promise<{
        investmentId: string;
        numericId: number;
    }>;
}
export interface ICreateInvestmentPayload {
    name: string;
    amount: number;
    startDate: string | Date;
    endDate?: string | Date | null;
    remarks: string;
    status?: TInvestmentStatus;
    isActive?: boolean;
    memberId?: string;
    memberName?: string;
    memberCode?: string;
}
export interface IUpdateInvestmentPayload {
    name?: string;
    amount?: number;
    startDate?: string | Date;
    endDate?: string | Date | null;
    remarks?: string;
    status?: TInvestmentStatus;
    isActive?: boolean;
    memberId?: string;
    memberName?: string;
    memberCode?: string;
}
export interface IInvestmentFilterQuery {
    search?: string;
    status?: string;
    isActive?: string;
    page?: string | number;
    limit?: string | number;
    fromDate?: string;
    toDate?: string;
}
//# sourceMappingURL=investment.interface.d.ts.map