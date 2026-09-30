"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentValidation = void 0;
const zod_1 = require("zod");
const createInvestmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Investment name is required"),
        amount: zod_1.z.number().min(0, "Amount must be greater than or equal to 0"),
        startDate: zod_1.z.string().min(1, "Start date is required"),
        endDate: zod_1.z.string().nullable().optional(),
        remarks: zod_1.z.string().min(1, "Remarks are required"),
        status: zod_1.z.enum(["Running", "Closed"]).optional(),
        isActive: zod_1.z.boolean().optional(),
        memberId: zod_1.z.string().optional(),
        memberName: zod_1.z.string().optional(),
        memberCode: zod_1.z.string().optional(),
    }),
});
const updateInvestmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        amount: zod_1.z.number().min(0).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().nullable().optional(),
        remarks: zod_1.z.string().min(1).optional(),
        status: zod_1.z.enum(["Running", "Closed"]).optional(),
        isActive: zod_1.z.boolean().optional(),
        memberId: zod_1.z.string().optional(),
        memberName: zod_1.z.string().optional(),
        memberCode: zod_1.z.string().optional(),
    }),
});
exports.InvestmentValidation = {
    createInvestmentValidationSchema,
    updateInvestmentValidationSchema,
};
//# sourceMappingURL=investment.validation.js.map