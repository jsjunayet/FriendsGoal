import { Document, Types } from "mongoose";
export interface INotification extends Document {
    recipientId: Types.ObjectId | string;
    title: string;
    message: string;
    type: "DUE_ALERT" | "DEPOSIT_SUCCESS" | "WITHDRAWAL_REQUEST" | "DIRECT_ADMIN_MSG" | "MEMBER_ONBOARDING" | "PASSWORD_RESET" | "SUPERADMIN_SECURITY_ALERT" | "GENERAL";
    channel: string[];
    isRead: boolean;
    requiresAction: boolean;
    isAcknowledged: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
}
//# sourceMappingURL=notification.interface.d.ts.map