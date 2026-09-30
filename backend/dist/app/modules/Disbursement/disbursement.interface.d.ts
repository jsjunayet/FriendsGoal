import type { Model, Types } from "mongoose";
export interface IDisbursement {
    _id?: Types.ObjectId | string;
    disbursementId: string;
    numericId: number;
    memberId: Types.ObjectId | string;
    memberName: string;
    memberCode?: string;
    disbursedAmount: number;
    disbursDate: Date;
    remarks?: string;
    createdBy?: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface DisbursementModel extends Model<IDisbursement> {
    getNextDisbursementId(): Promise<{
        disbursementId: string;
        numericId: number;
    }>;
}
export interface ICreateDisbursementPayload {
    memberId: string;
    paidAmount: number;
    disbursDate?: string | Date;
    remarks?: string;
}
export interface IDisbursementFilterQuery {
    fromDate?: string;
    toDate?: string;
    memberId?: string;
    search?: string;
    page?: string | number;
    limit?: string | number;
}
//# sourceMappingURL=disbursement.interface.d.ts.map