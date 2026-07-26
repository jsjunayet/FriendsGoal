import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string().nonempty('Id is required.'),
    password: z.string().nonempty('Password is required'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().nonempty('Old password is required'),
    newPassword: z.string().nonempty('Password is required'),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required!'),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string().nonempty('User id is required!'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string().nonempty('User id is required!'),
    newPassword: z.string().nonempty('User password is required!'),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
