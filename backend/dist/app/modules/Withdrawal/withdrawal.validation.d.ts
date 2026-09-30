import { z } from "zod";
export declare const WithdrawalValidation: {
    createWithdrawalValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            memberId: z.ZodString;
            amount: z.ZodNumber;
            method: z.ZodOptional<z.ZodEnum<{
                "Bank Transfer": "Bank Transfer";
                "Cash Pickup": "Cash Pickup";
                "Mobile Banking": "Mobile Banking";
            }>>;
            accountDetails: z.ZodOptional<z.ZodString>;
            payoutMethod: z.ZodOptional<z.ZodString>;
            accountNumber: z.ZodOptional<z.ZodString>;
            reason: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    respondWithdrawalValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            action: z.ZodEnum<{
                Approved: "Approved";
                Rejected: "Rejected";
                approve: "approve";
                reject: "reject";
            }>;
            adminNote: z.ZodOptional<z.ZodString>;
            reviewerName: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=withdrawal.validation.d.ts.map