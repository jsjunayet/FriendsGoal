"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalValidation = void 0;
const zod_1 = require("zod");
const createWithdrawalValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        memberId: zod_1.z.string().min(1, "Member ID is required"),
        amount: zod_1.z.number().positive("Withdrawal amount must be greater than 0"),
        method: zod_1.z
            .enum(["Mobile Banking", "Bank Transfer", "Cash Pickup"])
            .optional(),
        accountDetails: zod_1.z.string().optional(),
        payoutMethod: zod_1.z.string().optional(),
        accountNumber: zod_1.z.string().optional(),
        reason: zod_1.z.string().optional(),
    }),
});
const respondWithdrawalValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        action: zod_1.z.enum(["approve", "reject", "Approved", "Rejected"]),
        adminNote: zod_1.z.string().optional(),
        reviewerName: zod_1.z.string().optional(),
    }),
});
exports.WithdrawalValidation = {
    createWithdrawalValidationSchema,
    respondWithdrawalValidationSchema,
};
//# sourceMappingURL=withdrawal.validation.js.map