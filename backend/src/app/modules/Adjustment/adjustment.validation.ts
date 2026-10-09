import { z } from "zod";

const createAdjustmentValidationSchema = z.object({
  body: z.object({
    memberId: z.string().min(1, "Member ID is required"),
    adjustmentType: z.enum([
      "ADD",
      "SUB",
      "OTHER_RECEIVED",
    ] as const),
    adjustmentDate: z.string().optional(),
    adjustmentAmount: z.number().refine((val) => val !== 0, "Adjustment amount cannot be zero"),
    remarks: z.string().min(1, "Remarks are required"),
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
