import { Types } from "mongoose";

export type TAdjustmentType =
  | "credit"
  | "debit"
  | "fee_reversal"
  | "operational"
  | "PROFIT"
  | "DEPOSIT"
  | "DUE"
  | "profit"
  | "deposit"
  | "due";

export interface IAdjustmentBalanceSnapshot {
  totalDeposit: number;
  savingsBalance: number;
  dueAmount: number;
  profitBalance?: number;
}

export interface IAdjustment {
  _id?: Types.ObjectId;
  adjustmentId: string;
  memberId: Types.ObjectId;
  memberCode: string;
  memberName: string;
  adjustmentType: TAdjustmentType;
  adjustmentTypeName: string;
  adjustmentDate: Date;
  adjustmentAmount: number;
  signedAmount: number;
  previousBalance: IAdjustmentBalanceSnapshot;
  updatedBalance: IAdjustmentBalanceSnapshot;
  remarks: string;
  createdBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateAdjustmentPayload {
  memberId: string;
  adjustmentType: TAdjustmentType;
  adjustmentDate: string | Date;
  adjustmentAmount: number;
  remarks: string;
}

export interface IAdjustmentFilterParams {
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  adjustmentType?: string;
  page?: number | string;
  limit?: number | string;
}
