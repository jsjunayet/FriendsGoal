import { z } from "zod";
export declare const InvestmentValidation: {
    createInvestmentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            amount: z.ZodNumber;
            startDate: z.ZodString;
            endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            remarks: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                Closed: "Closed";
                Running: "Running";
            }>>;
            isActive: z.ZodOptional<z.ZodBoolean>;
            memberId: z.ZodOptional<z.ZodString>;
            memberName: z.ZodOptional<z.ZodString>;
            memberCode: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateInvestmentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            amount: z.ZodOptional<z.ZodNumber>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            remarks: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                Closed: "Closed";
                Running: "Running";
            }>>;
            isActive: z.ZodOptional<z.ZodBoolean>;
            memberId: z.ZodOptional<z.ZodString>;
            memberName: z.ZodOptional<z.ZodString>;
            memberCode: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=investment.validation.d.ts.map