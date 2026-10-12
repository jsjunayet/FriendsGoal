import { z } from "zod";

const createInvestmentIncomeSchema = z.object({
  body: z.object({
    investmentId: z.string().min(1, "Investment ID is required"),
    date: z.string().min(1, "Start Date is required"),
    amount: z.number().positive("Amount must be greater than zero"),
    remarks: z.string().min(1, "Remarks are required"),
  }),
});

export const InvestmentIncomeValidation = {
  createInvestmentIncomeSchema,
};
