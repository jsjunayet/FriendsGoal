import mongoose from "mongoose";
import { ICreateWithdrawalPayload, IRespondWithdrawalPayload } from "./withdrawal.interface";
/**
 * 1. Create a Withdrawal Request & Hold/Deduct from Profit Balance
 */
declare const createWithdrawalRequestInDB: (payload: ICreateWithdrawalPayload) => Promise<{
    withdrawal: mongoose.Document<unknown, {}, import("./withdrawal.interface").IWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./withdrawal.interface").IWithdrawal & Required<{
        _id: string | mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    profitDeduction: number;
    depositDeduction: number;
    remainingCombinedBalance: number;
}>;
/**
 * 2. Admin Respond: Approve or Reject a Withdrawal Request
 * PATCH /api/v1/withdrawals/:id/respond
 */
declare const respondWithdrawalInDB: (id: string, payload: IRespondWithdrawalPayload, adminUser?: any) => Promise<mongoose.Document<unknown, {}, import("./withdrawal.interface").IWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./withdrawal.interface").IWithdrawal & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 3. Get All Withdrawal Requests with counts & pagination
 */
declare const getWithdrawalsFromDB: (query: Record<string, any>) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        counts: {
            all: number;
            pending: number;
            approved: number;
            rejected: number;
        };
    };
    data: any[];
}>;
export declare const WithdrawalServices: {
    createWithdrawalRequestInDB: typeof createWithdrawalRequestInDB;
    respondWithdrawalInDB: typeof respondWithdrawalInDB;
    getWithdrawalsFromDB: typeof getWithdrawalsFromDB;
};
export {};
//# sourceMappingURL=withdrawal.service.d.ts.map