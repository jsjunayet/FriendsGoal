import type { Types } from "mongoose";

export type TWithdrawalStatus = "Pending" | "Approved" | "Rejected";
export type TWithdrawalMethod =
  | "Mobile Banking"
  | "Bank Transfer"
  | "Cash Pickup"
  | string;

export interface IWithdrawal {
  _id?: Types.ObjectId | string;
  referenceId: string; // e.g. "WD-A3F9C2"
  memberId: Types.ObjectId | string;
  memberName: string;
  memberCode?: string;
  amount: number;
  method: TWithdrawalMethod;
  accountDetails?: string;
  reason?: string;
  status: TWithdrawalStatus;
  adminNote?: string | undefined;
  reviewedBy?: Types.ObjectId | string | undefined;
  reviewedByName?: string | undefined;
  reviewedAt?: Date | undefined;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateWithdrawalPayload {
  memberId: string;
  amount: number;
  method?: TWithdrawalMethod;
  accountDetails?: string;
  reason?: string;
}

export interface IRespondWithdrawalPayload {
  action: "approve" | "reject" | "Approved" | "Rejected";
  adminNote?: string;
  reviewedBy?: string;
  reviewerName?: string;
}
