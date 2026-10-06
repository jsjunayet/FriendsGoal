import { Schema, model } from "mongoose";
import type { IStatCounter, StatCounterModel } from "./stats.interface";

const statCounterSchema = new Schema<IStatCounter, StatCounterModel>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      bn: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

export const StatCounter = model<IStatCounter, StatCounterModel>("StatCounter", statCounterSchema);
