import type { Types } from "mongoose";
export type TAuditAction = "Member Added" | "Payment Recorded" | "Due Updated" | "Withdrawal Approved" | "Withdrawal Rejected" | "Amount Modified" | "Report Generated" | "Settings Changed" | string;
export interface IAuditLog {
    _id?: Types.ObjectId | string;
    logId: string;
    adminId?: Types.ObjectId | string;
    adminName: string;
    adminAvatar?: string;
    adminRole?: string;
    action: TAuditAction;
    target: string;
    details: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICreateAuditLogPayload {
    adminId?: string;
    adminName?: string;
    adminAvatar?: string;
    adminRole?: string;
    action: TAuditAction;
    target: string;
    details: string;
    createdAt?: Date;
}
//# sourceMappingURL=auditLog.interface.d.ts.map