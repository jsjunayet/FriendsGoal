import { z } from "zod";

const createDisbursementValidationSchema = z.object({
  body: z.object({
    memberId: z.string().min(1, "Member ID is required"),
    paidAmount: z.number().positive("Paid amount must be a positive number"),
    disbursDate: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

const filterDisbursementsValidationSchema = z.object({
  query: z
    .object({
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      memberId: z.string().optional(),
      search: z.string().optional(),
      page: z.string().or(z.number()).optional(),
      limit: z.string().or(z.number()).optional(),
    })
    .optional(),
});

export const DisbursementValidation = {
  createDisbursementValidationSchema,
  filterDisbursementsValidationSchema,
};
