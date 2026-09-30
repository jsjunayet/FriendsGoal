"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseValidation = void 0;
const zod_1 = require("zod");
const createExpenseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        expenseHead: zod_1.z.string().min(1, "Expense head is required"),
        memberId: zod_1.z.string().optional(),
        memberName: zod_1.z.string().min(1, "Member name is required"),
        memberCode: zod_1.z.string().optional(),
        expenseDate: zod_1.z.string().min(1, "Expense date is required"),
        amount: zod_1.z.number().positive("Amount must be greater than 0"),
        remarks: zod_1.z.string().min(1, "Remarks are required"),
    }),
});
const updateExpenseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        expenseHead: zod_1.z.string().min(1).optional(),
        memberId: zod_1.z.string().optional(),
        memberName: zod_1.z.string().min(1).optional(),
        memberCode: zod_1.z.string().optional(),
        expenseDate: zod_1.z.string().optional(),
        amount: zod_1.z.number().positive().optional(),
        remarks: zod_1.z.string().min(1).optional(),
    }),
});
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required"),
        order: zod_1.z.number().optional(),
    }),
});
const reorderCategoriesValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        categories: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string().min(1, "Category ID is required"),
            order: zod_1.z.number(),
        }))
            .min(1, "At least one category is required to reorder"),
    }),
});
exports.ExpenseValidation = {
    createExpenseValidationSchema,
    updateExpenseValidationSchema,
    createCategoryValidationSchema,
    reorderCategoriesValidationSchema,
};
//# sourceMappingURL=expense.validation.js.map