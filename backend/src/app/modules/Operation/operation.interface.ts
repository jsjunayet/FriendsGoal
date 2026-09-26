import type { Types } from "mongoose";

export interface ICollection {
  _id?: string;
  member: Types.ObjectId | string;
  memberCode: string;
  memberName: string;
  amount: number;
  receiptNo: string;
  month: string;
  paymentDate: Date;
  paymentMethod: "cash" | "bank" | "mobile_banking";
  status: "Paid" | "Due" | "Advance";
  note?: string;
  receivedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMonthlyBill {
  _id?: string;
  member: Types.ObjectId | string;
  memberCode: string;
  memberName: string;
  billingMonth: string; // e.g. "June-2024" or "2024-06"
  amount: number; // default: 1000
  status: "Paid" | "Due" | "Advance";
  paidAmount: number;
  dueAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILedger {
  _id?: string;
  member: Types.ObjectId | string;
  memberCode: string;
  type: "deposit" | "monthly_fee" | "due_payment" | "adjustment";
  amount: number;
  previousDue: number;
  newDue: number;
  previousAdvance: number;
  newAdvance: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDueListItem {
  id: string;
  memberCode: string;
  memberName: string;
  mobileNo: string;
  dueAmount: number;
  advanceBalance: number;
  status: "Advance" | "Due" | "Zero";
}

export interface IExportFilterOptions {
  searchByCodeOrName?: string;
  year?: string;
  status?: "All" | "Advance" | "Due" | "Zero";
  dateRange?: string;
}
