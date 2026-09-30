import { z } from "zod";

const createInvestmentValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Investment name is required"),
    amount: z.number().min(0, "Amount must be greater than or equal to 0"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().nullable().optional(),
    remarks: z.string().min(1, "Remarks are required"),
    status: z.enum(["Running", "Closed"]).optional(),
    isActive: z.boolean().optional(),
    memberId: z.string().optional(),
    memberName: z.string().optional(),
    memberCode: z.string().optional(),
  }),
});

const updateInvestmentValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    amount: z.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().nullable().optional(),
    remarks: z.string().min(1).optional(),
    status: z.enum(["Running", "Closed"]).optional(),
    isActive: z.boolean().optional(),
    memberId: z.string().optional(),
    memberName: z.string().optional(),
    memberCode: z.string().optional(),
  }),
});

export const InvestmentValidation = {
  createInvestmentValidationSchema,
  updateInvestmentValidationSchema,
};
