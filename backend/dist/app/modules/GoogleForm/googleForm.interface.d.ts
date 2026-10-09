import type { Model } from "mongoose";
export interface IGoogleForm {
    _id?: string;
    title: string;
    embedUrl: string;
    rawInput?: string;
    description?: string;
    status: "Active" | "Inactive";
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type GoogleFormModel = Model<IGoogleForm>;
//# sourceMappingURL=googleForm.interface.d.ts.map