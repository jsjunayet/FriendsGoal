import { Schema, model } from "mongoose";
import type { IGoogleForm, GoogleFormModel } from "./googleForm.interface";

const googleFormSchema = new Schema<IGoogleForm, GoogleFormModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    embedUrl: {
      type: String,
      required: true,
      trim: true,
    },
    rawInput: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GoogleForm = model<IGoogleForm, GoogleFormModel>(
  "GoogleForm",
  googleFormSchema
);
