import { Schema, model } from "mongoose";
import { IInvestmentIncome, InvestmentIncomeModel } from "./investmentIncome.interface";

const investmentIncomeSchema = new Schema<IInvestmentIncome, InvestmentIncomeModel>(
  {
    numericId: {
      type: Number,
      required: true,
      unique: true,
    },
    investmentId: {
      type: Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    investmentName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    remarks: {
      type: String,
      required: true,
      trim: true,
    },
    distributedToCount: {
      type: Number,
      default: 0,
    },
    perMemberProfit: {
      type: Number,
      default: 0,
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
  { timestamps: true }
);

investmentIncomeSchema.statics.getNextNumericId = async function (): Promise<number> {
  const last = await this.findOne({}, { numericId: 1 }).sort({ numericId: -1 }).lean();
  return last && typeof last.numericId === "number" ? last.numericId + 1 : 1;
};

export const InvestmentIncome = model<IInvestmentIncome, InvestmentIncomeModel>(
  "InvestmentIncome",
  investmentIncomeSchema
);
