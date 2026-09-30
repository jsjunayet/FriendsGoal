import type { Response } from "express";
import type { IMember } from "./member.interface";
declare const createMemberIntoDB: (payload: IMember) => Promise<import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getAllMembersFromDB: (query: Record<string, unknown>) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
        _id: string;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
}>;
declare const getPublicCouncilMembersFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getSingleMemberFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateMemberIntoDB: (id: string, payload: Partial<IMember>) => Promise<(import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const deleteMemberFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IMember, {}, import("mongoose").DefaultSchemaOptions> & IMember & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const getMemberDashboardSummaryFromDB: (userIdOrEmail?: string) => Promise<{
    memberId: string;
    fullName: string;
    memberCode: string;
    email: string;
    role: string;
    status: string;
    bloodGroup: string;
    totalDeposit: number;
    dueAmount: number;
    profitBalance: number;
    totalWithdrawn: number;
    savingsBalance: number;
    depositBalance: number;
    pendingWithdrawal: number;
    activePaymentSchedule: never[];
    dateOfBirth?: never;
    division?: never;
    district?: never;
    thana?: never;
    pictureUrl?: never;
} | {
    memberId: string;
    fullName: string;
    memberCode: string;
    email: string;
    role: import("./member.interface").TMemberRole;
    status: import("./member.interface").TMemberStatus;
    bloodGroup: string | undefined;
    dateOfBirth: string | undefined;
    division: string | undefined;
    district: string | undefined;
    thana: string | undefined;
    pictureUrl: string | undefined;
    totalDeposit: number;
    dueAmount: number;
    profitBalance: number;
    totalWithdrawn: number;
    savingsBalance: number;
    depositBalance: number;
    pendingWithdrawal: number;
    activePaymentSchedule: {
        receiptNo: string;
        month: string;
        amount: number;
        status: "Advance" | "Due" | "Paid";
        paymentDate: Date;
        paymentMethod: "bank" | "cash" | "mobile_banking";
    }[];
}>;
declare const getMemberProfitBalanceFromDB: (userIdOrId?: string) => Promise<{
    profitBalance: number;
    memberId?: never;
    fullName?: never;
    memberName?: never;
    memberCode?: never;
    totalDeposit?: never;
    dueAmount?: never;
    totalWithdrawn?: never;
} | {
    memberId: string;
    fullName: string;
    memberName: string;
    memberCode: string;
    profitBalance: number;
    totalDeposit: number;
    dueAmount: number;
    totalWithdrawn: number;
}>;
/**
 * 9. Export All Members Directory (Streaming PDF & Excel)
 * High-performance, zero-memory-leak cursor batching for 1,000+ members.
 */
declare const exportAllMembersFromDB: (res: Response, query: {
    status?: string;
    format?: string;
}) => Promise<void>;
/**
 * 10. Export Single Member Profile Card & Financial Statement (Streaming PDF & Excel)
 */
declare const exportSingleMemberFromDB: (res: Response, id: string, format?: string) => Promise<void>;
export declare const MemberServices: {
    createMemberIntoDB: typeof createMemberIntoDB;
    getAllMembersFromDB: typeof getAllMembersFromDB;
    getPublicCouncilMembersFromDB: typeof getPublicCouncilMembersFromDB;
    getSingleMemberFromDB: typeof getSingleMemberFromDB;
    updateMemberIntoDB: typeof updateMemberIntoDB;
    deleteMemberFromDB: typeof deleteMemberFromDB;
    getMemberDashboardSummaryFromDB: typeof getMemberDashboardSummaryFromDB;
    getMemberProfitBalanceFromDB: typeof getMemberProfitBalanceFromDB;
    exportAllMembersFromDB: typeof exportAllMembersFromDB;
    exportSingleMemberFromDB: typeof exportSingleMemberFromDB;
};
export {};
//# sourceMappingURL=member.service.d.ts.map