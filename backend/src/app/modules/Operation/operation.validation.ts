import { z } from "zod";

const collectPaymentValidationSchema = z.object({
  body: z.object({
    memberId: z.string().min(1, "Member ID is required"),
    amount: z.number().min(1, "Amount must be at least 1"),
    paymentMethod: z.enum(["cash", "bank", "mobile_banking"]).optional(),
    month: z.string().optional(),
    note: z.string().optional(),
  }),
});

const dueListQueryValidationSchema = z.object({
  query: z
    .object({
      searchByCodeOrName: z.string().optional(),
      year: z.string().optional(),
      status: z.enum(["All", "Advance", "Due", "Zero"]).optional(),
      dateRange: z.string().optional(),
      page: z.string().or(z.number()).optional(),
      limit: z.string().or(z.number()).optional(),
    })
    .optional(),
});

const exportQueryValidationSchema = z.object({
  query: z
    .object({
      searchByCodeOrName: z.string().optional(),
      year: z.string().optional(),
      status: z.string().optional(),
      dateRange: z.string().optional(),
    })
    .optional(),
});

export const OperationValidation = {
  collectPaymentValidationSchema,
  dueListQueryValidationSchema,
  exportQueryValidationSchema,
};
