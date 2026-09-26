"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentValidation = void 0;
const zod_1 = require("zod");
const createAdjustmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        memberId: zod_1.z.string().min(1, "Member ID is required"),
        adjustmentType: zod_1.z.enum(["credit", "debit", "fee_reversal", "operational"]),
        adjustmentDate: zod_1.z.string().optional(),
        adjustmentAmount: zod_1.z.number().positive("Adjustment amount must be a positive number"),
        remarks: zod_1.z.string().min(3, "Remarks must contain at least 3 characters"),
    }),
});
const filterAdjustmentsValidationSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        fromDate: zod_1.z.string().optional(),
        toDate: zod_1.z.string().optional(),
        searchTerm: zod_1.z.string().optional(),
        adjustmentType: zod_1.z.string().optional(),
        page: zod_1.z.string().or(zod_1.z.number()).optional(),
        limit: zod_1.z.string().or(zod_1.z.number()).optional(),
    })
        .optional(),
});
exports.AdjustmentValidation = {
    createAdjustmentValidationSchema,
    filterAdjustmentsValidationSchema,
};
//# sourceMappingURL=adjustment.validation.js.map