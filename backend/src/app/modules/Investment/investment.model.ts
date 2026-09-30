import { Schema, model } from "mongoose";
import { IInvestment, InvestmentModel } from "./investment.interface";

const investmentSchema = new Schema<IInvestment, InvestmentModel>(
  {
    investmentId: {
      type: String,
      required: [true, "Investment ID is required"],
      unique: true,
      trim: true,
    },
    numericId: {
      type: Number,
      required: [true, "Numeric ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Investment name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than or equal to 0"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      required: [true, "Remarks are required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Running", "Closed"],
      default: "Running",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
    memberName: {
      type: String,
      trim: true,
    },
    memberCode: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

investmentSchema.statics.getNextInvestmentId = async function (): Promise<{
  investmentId: string;
  numericId: number;
}> {
  const last = await this.findOne({}, { numericId: 1 })
    .sort({ numericId: -1 })
    .lean();

  const nextNumeric = last && typeof last.numericId === "number" ? last.numericId + 1 : 1;
  const investmentId = String(nextNumeric).padStart(3, "0");

  return { investmentId, numericId: nextNumeric };
};

export const Investment = model<IInvestment, InvestmentModel>(
  "Investment",
  investmentSchema
);
