import { z } from "zod";
export declare const DisbursementValidation: {
    createDisbursementValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            memberId: z.ZodString;
            paidAmount: z.ZodNumber;
            disbursDate: z.ZodOptional<z.ZodString>;
            remarks: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    filterDisbursementsValidationSchema: z.ZodObject<{
        query: z.ZodOptional<z.ZodObject<{
            fromDate: z.ZodOptional<z.ZodString>;
            toDate: z.ZodOptional<z.ZodString>;
            memberId: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            limit: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=disbursement.validation.d.ts.map