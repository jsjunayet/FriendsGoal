import type { Types } from "mongoose";

export type TAuditAction =
  | "Member Added"
  | "Payment Recorded"
  | "Due Updated"
  | "Withdrawal Approved"
  | "Withdrawal Rejected"
  | "Amount Modified"
  | "Report Generated"
  | "Settings Changed"
  | string;

export interface IAuditLog {
  _id?: Types.ObjectId | string;
  logId: string; // e.g. "001", "002"
  adminId?: Types.ObjectId | string;
  adminName: string; // e.g. "Rania Islam", "Sajid Mahmud"
  adminAvatar?: string; // e.g. "RI", "SM"
  adminRole?: string;
  action: TAuditAction;
  target: string; // e.g. "MD Karim Hossain", "Fatema Begum", "System"
  details: string; // e.g. "Withdrawal request WD-A3F9C2 approved for 4,554."
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
