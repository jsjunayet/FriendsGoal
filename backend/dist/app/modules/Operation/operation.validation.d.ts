import { z } from "zod";
export declare const OperationValidation: {
    collectPaymentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            memberId: z.ZodString;
            amount: z.ZodNumber;
            paymentMethod: z.ZodOptional<z.ZodEnum<{
                bank: "bank";
                cash: "cash";
                mobile_banking: "mobile_banking";
            }>>;
            month: z.ZodOptional<z.ZodString>;
            note: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    dueListQueryValidationSchema: z.ZodObject<{
        query: z.ZodOptional<z.ZodObject<{
            searchByCodeOrName: z.ZodOptional<z.ZodString>;
            year: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                Advance: "Advance";
                All: "All";
                Due: "Due";
                Zero: "Zero";
            }>>;
            dateRange: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            limit: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    exportQueryValidationSchema: z.ZodObject<{
        query: z.ZodOptional<z.ZodObject<{
            searchByCodeOrName: z.ZodOptional<z.ZodString>;
            year: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            dateRange: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=operation.validation.d.ts.map