"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementValidation = void 0;
const zod_1 = require("zod");
const createDisbursementValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        memberId: zod_1.z.string().min(1, "Member ID is required"),
        paidAmount: zod_1.z.number().positive("Paid amount must be a positive number"),
        disbursDate: zod_1.z.string().optional(),
        remarks: zod_1.z.string().optional(),
    }),
});
const filterDisbursementsValidationSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        fromDate: zod_1.z.string().optional(),
        toDate: zod_1.z.string().optional(),
        memberId: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().or(zod_1.z.number()).optional(),
        limit: zod_1.z.string().or(zod_1.z.number()).optional(),
    })
        .optional(),
});
exports.DisbursementValidation = {
    createDisbursementValidationSchema,
    filterDisbursementsValidationSchema,
};
//# sourceMappingURL=disbursement.validation.js.map