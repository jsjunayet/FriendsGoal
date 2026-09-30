import { IWithdrawal } from "./withdrawal.interface";
export declare const generateWithdrawalReferenceId: () => string;
export declare const Withdrawal: import("mongoose").Model<IWithdrawal, {}, {}, {}, import("mongoose").Document<unknown, {}, IWithdrawal, {}, import("mongoose").DefaultSchemaOptions> & IWithdrawal & Required<{
    _id: string | import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWithdrawal>;
//# sourceMappingURL=withdrawal.model.d.ts.map