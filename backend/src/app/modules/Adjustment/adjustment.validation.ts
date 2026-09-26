import { z } from "zod";

const createAdjustmentValidationSchema = z.object({
  body: z.object({
    memberId: z.string().min(1, "Member ID is required"),
    adjustmentType: z.enum(["credit", "debit", "fee_reversal", "operational"] as const),
    adjustmentDate: z.string().optional(),
    adjustmentAmount: z.number().positive("Adjustment amount must be a positive number"),
    remarks: z.string().min(3, "Remarks must contain at least 3 characters"),
  }),
});

const filterAdjustmentsValidationSchema = z.object({
  query: z
    .object({
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      searchTerm: z.string().optional(),
      adjustmentType: z.string().optional(),
      page: z.string().or(z.number()).optional(),
      limit: z.string().or(z.number()).optional(),
    })
    .optional(),
});

export const AdjustmentValidation = {
  createAdjustmentValidationSchema,
  filterAdjustmentsValidationSchema,
};
