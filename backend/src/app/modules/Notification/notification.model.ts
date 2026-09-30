import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "DUE_ALERT",
      "DEPOSIT_SUCCESS",
      "WITHDRAWAL_REQUEST",
      "DIRECT_ADMIN_MSG",
      "MEMBER_ONBOARDING",
      "PASSWORD_RESET",
      "SUPERADMIN_SECURITY_ALERT",
      "GENERAL",
    ],
    default: "GENERAL",
  },
  channel: { type: [String], default: ["IN_APP"] },
  isRead: { type: Boolean, default: false },
  requiresAction: { type: Boolean, default: false },
  isAcknowledged: { type: Boolean, default: false },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model<INotification>("Notification", notificationSchema);
