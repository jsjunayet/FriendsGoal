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
export declare const MemberServices: {
    createMemberIntoDB: typeof createMemberIntoDB;
    getAllMembersFromDB: typeof getAllMembersFromDB;
    getPublicCouncilMembersFromDB: typeof getPublicCouncilMembersFromDB;
    getSingleMemberFromDB: typeof getSingleMemberFromDB;
    updateMemberIntoDB: typeof updateMemberIntoDB;
    deleteMemberFromDB: typeof deleteMemberFromDB;
};
export {};
//# sourceMappingURL=member.service.d.ts.map