import { z } from "zod";
export declare const InvestmentIncomeValidation: {
    createInvestmentIncomeSchema: z.ZodObject<{
        body: z.ZodObject<{
            investmentId: z.ZodString;
            date: z.ZodString;
            amount: z.ZodNumber;
            remarks: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=investmentIncome.validation.d.ts.map