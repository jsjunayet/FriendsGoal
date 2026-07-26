import { type JwtPayload } from 'jsonwebtoken';
import type { TLoginUser } from './auth.interface';
declare const loginUser: (payload: TLoginUser) => Promise<{
    accessToken: string;
    refreshToken: string;
    needsPasswordChange: boolean;
}>;
declare const changePassword: (userData: JwtPayload, payload: {
    oldPassword: string;
    newPassword: string;
}) => Promise<null>;
declare const refreshToken: (token: string) => Promise<{
    accessToken: string;
}>;
declare const forgetPassword: (userId: string) => Promise<void>;
declare const resetPassword: (payload: {
    id: string;
    newPassword: string;
}, token: string) => Promise<void>;
export declare const AuthServices: {
    loginUser: typeof loginUser;
    changePassword: typeof changePassword;
    refreshToken: typeof refreshToken;
    forgetPassword: typeof forgetPassword;
    resetPassword: typeof resetPassword;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map