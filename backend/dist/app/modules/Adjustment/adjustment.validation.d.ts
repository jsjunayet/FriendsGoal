import { z } from "zod";
export declare const AdjustmentValidation: {
    createAdjustmentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            memberId: z.ZodString;
            adjustmentType: z.ZodEnum<{
                credit: "credit";
                debit: "debit";
                fee_reversal: "fee_reversal";
                operational: "operational";
            }>;
            adjustmentDate: z.ZodOptional<z.ZodString>;
            adjustmentAmount: z.ZodNumber;
            remarks: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    filterAdjustmentsValidationSchema: z.ZodObject<{
        query: z.ZodOptional<z.ZodObject<{
            fromDate: z.ZodOptional<z.ZodString>;
            toDate: z.ZodOptional<z.ZodString>;
            searchTerm: z.ZodOptional<z.ZodString>;
            adjustmentType: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            limit: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=adjustment.validation.d.ts.map