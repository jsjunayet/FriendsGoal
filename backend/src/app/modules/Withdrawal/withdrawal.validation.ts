import { z } from "zod";

const createWithdrawalValidationSchema = z.object({
  body: z.object({
    memberId: z.string().min(1, "Member ID is required"),
    amount: z.number().positive("Withdrawal amount must be greater than 0"),
    method: z
      .enum(["Mobile Banking", "Bank Transfer", "Cash Pickup"])
      .optional(),
    accountDetails: z.string().optional(),
    payoutMethod: z.string().optional(),
    accountNumber: z.string().optional(),
    reason: z.string().optional(),
  }),
});

const respondWithdrawalValidationSchema = z.object({
  body: z.object({
    action: z.enum(["approve", "reject", "Approved", "Rejected"]),
    adminNote: z.string().optional(),
    reviewerName: z.string().optional(),
  }),
});

export const WithdrawalValidation = {
  createWithdrawalValidationSchema,
  respondWithdrawalValidationSchema,
};
