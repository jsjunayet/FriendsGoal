import { Schema, model } from "mongoose";
import { IDisbursement, DisbursementModel } from "./disbursement.interface";

const disbursementSchema = new Schema<IDisbursement, DisbursementModel>(
  {
    disbursementId: {
      type: String,
      required: [true, "Disbursement ID is required"],
      unique: true,
      trim: true,
    },
    numericId: {
      type: Number,
      required: [true, "Numeric ID is required"],
      unique: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
    },
    memberName: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    memberCode: {
      type: String,
      trim: true,
    },
    disbursedAmount: {
      type: Number,
      required: [true, "Disbursed amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    disbursDate: {
      type: Date,
      required: [true, "Disbursement date is required"],
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
      default: "Profit Disbursement Payout",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

disbursementSchema.statics.getNextDisbursementId = async function (): Promise<{
  disbursementId: string;
  numericId: number;
}> {
  const last = await this.findOne({}, { numericId: 1 })
    .sort({ numericId: -1 })
    .lean();

  const nextNumeric =
    last && typeof last.numericId === "number"
      ? Math.max(101, last.numericId + 1)
      : 101;
  const disbursementId = String(nextNumeric);

  return { disbursementId, numericId: nextNumeric };
};

export const Disbursement = model<IDisbursement, DisbursementModel>(
  "Disbursement",
  disbursementSchema
);
