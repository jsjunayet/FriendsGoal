import { Schema, model } from "mongoose";
import type { ICollection, IMonthlyBill, ILedger } from "./operation.interface";

// ─── 1. Collection Schema ─────────────────────────────────────────────────────

const collectionSchema = new Schema<ICollection>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
    },
    memberCode: {
      type: String,
      required: [true, "Member Code is required"],
      trim: true,
    },
    memberName: {
      type: String,
      required: [true, "Member Name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    receiptNo: {
      type: String,
      required: [true, "Receipt No is required"],
      unique: true,
      trim: true,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "mobile_banking"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["Paid", "Due", "Advance"],
      default: "Paid",
    },
    note: {
      type: String,
      trim: true,
    },
    receivedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

collectionSchema.index({ member: 1, createdAt: -1 });
collectionSchema.index({ memberCode: 1, createdAt: -1 });
collectionSchema.index({ month: 1 });
collectionSchema.index({ receiptNo: 1 });

export const Collection = model<ICollection>("Collection", collectionSchema);

// ─── 2. Monthly Bill Schema ───────────────────────────────────────────────────

const monthlyBillSchema = new Schema<IMonthlyBill>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
    },
    memberCode: {
      type: String,
      required: [true, "Member Code is required"],
      trim: true,
    },
    memberName: {
      type: String,
      required: [true, "Member Name is required"],
      trim: true,
    },
    billingMonth: {
      type: String,
      required: [true, "Billing Month is required"],
      trim: true,
    },
    amount: {
      type: Number,
      default: 1000,
    },
    status: {
      type: String,
      enum: ["Paid", "Due", "Advance"],
      default: "Due",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

monthlyBillSchema.index({ member: 1, billingMonth: 1 }, { unique: true });
monthlyBillSchema.index({ memberCode: 1, billingMonth: 1 });

export const MonthlyBill = model<IMonthlyBill>("MonthlyBill", monthlyBillSchema);

// ─── 3. Ledger Schema ─────────────────────────────────────────────────────────

const ledgerSchema = new Schema<ILedger>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
    },
    memberCode: {
      type: String,
      required: [true, "Member Code is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["deposit", "monthly_fee", "due_payment", "adjustment"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    previousDue: {
      type: Number,
      default: 0,
    },
    newDue: {
      type: Number,
      default: 0,
    },
    previousAdvance: {
      type: Number,
      default: 0,
    },
    newAdvance: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ledgerSchema.index({ member: 1, createdAt: -1 });

export const Ledger = model<ILedger>("Ledger", ledgerSchema);
