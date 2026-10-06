import { Schema, model } from "mongoose";
import { IMarqueeItem, MarqueeModel } from "./marquee.interface";

const marqueeSchema = new Schema<IMarqueeItem, MarqueeModel>(
  {
    headline: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
    },
    targetLink: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases for text and link
marqueeSchema.virtual("text").get(function () {
  return this.headline;
});

marqueeSchema.virtual("link").get(function () {
  return this.targetLink;
});

// Middleware pre-validation to sanitize incoming payload for headline/text and targetLink/link
marqueeSchema.pre("validate", function (this: any) {
  if (!this.headline && this.text) {
    this.headline = this.text;
  }
  if (!this.targetLink && this.link) {
    this.targetLink = this.link;
  }
});

export const Marquee = model<IMarqueeItem, MarqueeModel>("MarqueeTicker", marqueeSchema);
