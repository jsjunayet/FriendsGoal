import mongoose from "mongoose";
import { ICreateDisbursementPayload, IDisbursementFilterQuery } from "./disbursement.interface";
/**
 * 1. Fetch active member profitBalance
 */
declare const getMemberProfitBalanceFromDB: (memberId: string) => Promise<{
    memberId: string;
    memberName: string;
    memberCode: string;
    profitBalance: number;
    totalDeposit: number;
    dueAmount: number;
}>;
/**
 * 2. Process Payout Transaction with Atomic Balance Deduction
 */
declare const createDisbursementInDB: (payload: ICreateDisbursementPayload, userId?: string) => Promise<mongoose.Document<unknown, {}, import("./disbursement.interface").IDisbursement, {}, mongoose.DefaultSchemaOptions> & import("./disbursement.interface").IDisbursement & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 3. Fetch Payout Audit List with Date Filtering & Search
 */
declare const getDisbursementsFromDB: (filters: IDisbursementFilterQuery) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("./disbursement.interface").IDisbursement & Required<{
        _id: string | mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
export declare const DisbursementServices: {
    getMemberProfitBalanceFromDB: typeof getMemberProfitBalanceFromDB;
    createDisbursementInDB: typeof createDisbursementInDB;
    getDisbursementsFromDB: typeof getDisbursementsFromDB;
};
export {};
//# sourceMappingURL=disbursement.service.d.ts.map