import { Schema, model } from "mongoose";
import { IAdjustment } from "./adjustment.interface";

const adjustmentBalanceSnapshotSchema = new Schema(
  {
    totalDeposit: { type: Number, default: 0 },
    savingsBalance: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    profitBalance: { type: Number, default: 0 },
  },
  { _id: false }
);

const adjustmentSchema = new Schema<IAdjustment>(
  {
    adjustmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    memberCode: {
      type: String,
      required: true,
      trim: true,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    adjustmentType: {
      type: String,
      enum: [
        "credit",
        "debit",
        "fee_reversal",
        "operational",
        "PROFIT",
        "DEPOSIT",
        "DUE",
        "profit",
        "deposit",
        "due",
      ],
      required: [true, "Adjustment type is required"],
    },
    adjustmentTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    adjustmentDate: {
      type: Date,
      required: [true, "Adjustment date is required"],
      default: Date.now,
      index: true,
    },
    adjustmentAmount: {
      type: Number,
      required: [true, "Adjustment amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    signedAmount: {
      type: Number,
      required: true,
    },
    previousBalance: {
      type: adjustmentBalanceSnapshotSchema,
      required: true,
    },
    updatedBalance: {
      type: adjustmentBalanceSnapshotSchema,
      required: true,
    },
    remarks: {
      type: String,
      required: [true, "Remarks are required for audit justification"],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

adjustmentSchema.index({ adjustmentDate: -1, createdAt: -1 });

export const Adjustment = model<IAdjustment>("Adjustment", adjustmentSchema);
