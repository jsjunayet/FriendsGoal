import { Schema, model } from "mongoose";
import { IAuditLog } from "./auditLog.interface";

const auditLogSchema = new Schema<IAuditLog>(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    adminName: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    adminAvatar: {
      type: String,
      trim: true,
    },
    adminRole: {
      type: String,
      trim: true,
      default: "Admin",
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
    },
    target: {
      type: String,
      required: [true, "Target is required"],
      trim: true,
    },
    details: {
      type: String,
      required: [true, "Details is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ target: "text", details: "text", adminName: "text" });

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
