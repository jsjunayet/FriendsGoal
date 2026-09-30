import { ICreateAuditLogPayload } from "./auditLog.interface";
export declare const generateNextLogId: () => Promise<string>;
/**
 * 1. Log an admin action
 */
declare const createAuditLogInDB: (payload: ICreateAuditLogPayload) => Promise<import("mongoose").Document<unknown, {}, import("./auditLog.interface").IAuditLog, {}, import("mongoose").DefaultSchemaOptions> & import("./auditLog.interface").IAuditLog & Required<{
    _id: string | import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * 2. Get Audit Logs with pagination & filters
 */
declare const getAuditLogsFromDB: (query: Record<string, any>) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("./auditLog.interface").IAuditLog & Required<{
        _id: string | import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
export declare const AuditLogServices: {
    createAuditLogInDB: typeof createAuditLogInDB;
    getAuditLogsFromDB: typeof getAuditLogsFromDB;
};
export {};
//# sourceMappingURL=auditLog.service.d.ts.map