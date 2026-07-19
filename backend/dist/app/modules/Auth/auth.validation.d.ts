import { z } from 'zod';
export declare const AuthValidation: {
    loginValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            id: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    changePasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            oldPassword: z.ZodString;
            newPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    refreshTokenValidationSchema: z.ZodObject<{
        cookies: z.ZodObject<{
            refreshToken: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    forgetPasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    resetPasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            id: z.ZodString;
            newPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validation.d.ts.map