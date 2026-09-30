import { z } from "zod";

const createExpenseValidationSchema = z.object({
  body: z.object({
    expenseHead: z.string().min(1, "Expense head is required"),
    memberId: z.string().optional(),
    memberName: z.string().min(1, "Member name is required"),
    memberCode: z.string().optional(),
    expenseDate: z.string().min(1, "Expense date is required"),
    amount: z.number().positive("Amount must be greater than 0"),
    remarks: z.string().min(1, "Remarks are required"),
  }),
});

const updateExpenseValidationSchema = z.object({
  body: z.object({
    expenseHead: z.string().min(1).optional(),
    memberId: z.string().optional(),
    memberName: z.string().min(1).optional(),
    memberCode: z.string().optional(),
    expenseDate: z.string().optional(),
    amount: z.number().positive().optional(),
    remarks: z.string().min(1).optional(),
  }),
});

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    order: z.number().optional(),
  }),
});

const reorderCategoriesValidationSchema = z.object({
  body: z.object({
    categories: z
      .array(
        z.object({
          id: z.string().min(1, "Category ID is required"),
          order: z.number(),
        })
      )
      .min(1, "At least one category is required to reorder"),
  }),
});

export const ExpenseValidation = {
  createExpenseValidationSchema,
  updateExpenseValidationSchema,
  createCategoryValidationSchema,
  reorderCategoriesValidationSchema,
};
