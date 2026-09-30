import { USER_ROLE } from './user.constant';
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUser = {
    id: string;
    email: string;
    password: string;
    needsPasswordChange: boolean;
    role: TUserRole;
    status: string;
    isDeleted: boolean;
    passwordChangedAt?: Date;
};
//# sourceMappingURL=user.interface.d.ts.map