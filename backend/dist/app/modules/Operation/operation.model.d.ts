import type { ICollection, IMonthlyBill, ILedger } from "./operation.interface";
export declare const Collection: import("mongoose").Model<ICollection, {}, {}, {}, import("mongoose").Document<unknown, {}, ICollection, {}, import("mongoose").DefaultSchemaOptions> & ICollection & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICollection>;
export declare const MonthlyBill: import("mongoose").Model<IMonthlyBill, {}, {}, {}, import("mongoose").Document<unknown, {}, IMonthlyBill, {}, import("mongoose").DefaultSchemaOptions> & IMonthlyBill & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMonthlyBill>;
export declare const Ledger: import("mongoose").Model<ILedger, {}, {}, {}, import("mongoose").Document<unknown, {}, ILedger, {}, import("mongoose").DefaultSchemaOptions> & ILedger & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILedger>;
//# sourceMappingURL=operation.model.d.ts.map