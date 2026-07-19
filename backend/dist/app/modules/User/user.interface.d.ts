export type TUserRole = 'superAdmin' | 'admin' | 'faculty' | 'student';
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