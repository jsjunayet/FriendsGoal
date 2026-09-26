import mongoose from "mongoose";
import { ICreateAdjustmentPayload, IAdjustmentFilterParams } from "./adjustment.interface";
/**
 * 1. Create Adjustment with atomic financial recalculation
 */
declare const createAdjustmentInDB: (payload: ICreateAdjustmentPayload, userId?: string) => Promise<mongoose.Document<unknown, {}, import("./adjustment.interface").IAdjustment, {}, mongoose.DefaultSchemaOptions> & import("./adjustment.interface").IAdjustment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 2. Get Filtered Adjustments with Date Range & Pagination
 */
declare const getAdjustmentsFromDB: (filters: IAdjustmentFilterParams) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("./adjustment.interface").IAdjustment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
/**
 * 3. Get Single Adjustment Details by ID
 */
declare const getSingleAdjustmentFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("./adjustment.interface").IAdjustment, {}, mongoose.DefaultSchemaOptions> & import("./adjustment.interface").IAdjustment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const AdjustmentServices: {
    createAdjustmentInDB: typeof createAdjustmentInDB;
    getAdjustmentsFromDB: typeof getAdjustmentsFromDB;
    getSingleAdjustmentFromDB: typeof getSingleAdjustmentFromDB;
};
export {};
//# sourceMappingURL=adjustment.service.d.ts.map