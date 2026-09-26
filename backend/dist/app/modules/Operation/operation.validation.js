"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationValidation = void 0;
const zod_1 = require("zod");
const collectPaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        memberId: zod_1.z.string().min(1, "Member ID is required"),
        amount: zod_1.z.number().min(1, "Amount must be at least 1"),
        paymentMethod: zod_1.z.enum(["cash", "bank", "mobile_banking"]).optional(),
        month: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
    }),
});
const dueListQueryValidationSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        searchByCodeOrName: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
        status: zod_1.z.enum(["All", "Advance", "Due", "Zero"]).optional(),
        dateRange: zod_1.z.string().optional(),
        page: zod_1.z.string().or(zod_1.z.number()).optional(),
        limit: zod_1.z.string().or(zod_1.z.number()).optional(),
    })
        .optional(),
});
const exportQueryValidationSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        searchByCodeOrName: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        dateRange: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.OperationValidation = {
    collectPaymentValidationSchema,
    dueListQueryValidationSchema,
    exportQueryValidationSchema,
};
//# sourceMappingURL=operation.validation.js.map