"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentIncomeValidation = void 0;
const zod_1 = require("zod");
const createInvestmentIncomeSchema = zod_1.z.object({
    body: zod_1.z.object({
        investmentId: zod_1.z.string().min(1, "Investment ID is required"),
        date: zod_1.z.string().min(1, "Start Date is required"),
        amount: zod_1.z.number().min(0, "Amount must be a positive number or zero"),
        remarks: zod_1.z.string().min(1, "Remarks are required"),
    }),
});
exports.InvestmentIncomeValidation = {
    createInvestmentIncomeSchema,
};
//# sourceMappingURL=investmentIncome.validation.js.map