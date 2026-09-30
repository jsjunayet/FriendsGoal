import mongoose from "mongoose";
import { ICreateInvestmentPayload, IUpdateInvestmentPayload, IInvestmentFilterQuery } from "./investment.interface";
/**
 * 1. Create a new Investment
 * - Financial Accounting Rule: Selecting member is ONLY for tracking; NEVER alters member ledger.
 * - Initial state: status defaults to 'Running', isActive to true, endDate null.
 */
declare const createInvestmentInDB: (payload: ICreateInvestmentPayload, userId?: string) => Promise<mongoose.Document<unknown, {}, import("./investment.interface").IInvestment, {}, mongoose.DefaultSchemaOptions> & import("./investment.interface").IInvestment & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 2. Get All Investments with Search & Filter
 */
declare const getInvestmentsFromDB: (query: IInvestmentFilterQuery) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("./investment.interface").IInvestment & Required<{
        _id: string | mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
/**
 * 3. Get Single Investment by ID
 */
declare const getSingleInvestmentFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./investment.interface").IInvestment, {}, mongoose.DefaultSchemaOptions> & import("./investment.interface").IInvestment & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 4. Close an active Investment
 * - Sets endDate to today (Date.now())
 * - Updates status from 'Running' to 'Closed'
 * - Updates isActive from true to false
 * - DOES NOT modify member balances
 */
declare const closeInvestmentInDB: (id: string) => Promise<(mongoose.Document<unknown, {}, import("./investment.interface").IInvestment, {}, mongoose.DefaultSchemaOptions> & import("./investment.interface").IInvestment & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
/**
 * 5. Update Investment
 */
declare const updateInvestmentInDB: (id: string, payload: IUpdateInvestmentPayload) => Promise<mongoose.Document<unknown, {}, import("./investment.interface").IInvestment, {}, mongoose.DefaultSchemaOptions> & import("./investment.interface").IInvestment & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 6. Delete Investment (Soft delete)
 */
declare const deleteInvestmentFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./investment.interface").IInvestment, {}, mongoose.DefaultSchemaOptions> & import("./investment.interface").IInvestment & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const InvestmentServices: {
    createInvestmentInDB: typeof createInvestmentInDB;
    getInvestmentsFromDB: typeof getInvestmentsFromDB;
    getSingleInvestmentFromDB: typeof getSingleInvestmentFromDB;
    closeInvestmentInDB: typeof closeInvestmentInDB;
    updateInvestmentInDB: typeof updateInvestmentInDB;
    deleteInvestmentFromDB: typeof deleteInvestmentFromDB;
};
export {};
//# sourceMappingURL=investment.service.d.ts.map