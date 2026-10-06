import { Schema, model } from "mongoose";
import type { INotice, NoticeModel, IAgendaItem } from "./notice.interface";

const agendaItemSchema = new Schema<IAgendaItem>(
  {
    num: { type: Number },
    title: {
      bn: { type: String, default: "", trim: true },
      en: { type: String, default: "", trim: true },
    },
    text: {
      bn: { type: String, default: "", trim: true },
      en: { type: String, default: "", trim: true },
    },
  },
  { _id: false }
);

const noticeSchema = new Schema<INotice, NoticeModel>(
  {
    category: {
      bn: { type: String, default: "আনুষ্ঠানিক নোটিশ", trim: true },
      en: { type: String, default: "OFFICIAL NOTICE", trim: true },
    },
    title: {
      bn: { type: String, required: [true, "Bangla title is required"], trim: true },
      en: { type: String, required: [true, "English title is required"], trim: true },
    },
    description: {
      bn: { type: String, default: "", trim: true },
      en: { type: String, default: "", trim: true },
    },
    content: {
      bn: { type: String, default: "", trim: true },
      en: { type: String, default: "", trim: true },
    },
    images: {
      type: [String],
      default: [],
    },
    publishedDate: {
      type: String,
      default: "",
    },
    isTickerActive: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: "ADMIN",
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    agendaHighlights: {
      type: [agendaItemSchema],
      default: [],
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

noticeSchema.index({ isDeleted: 1, createdAt: -1 });
noticeSchema.index({ isTickerActive: 1 });

export const Notice = model<INotice, NoticeModel>("Notice", noticeSchema);

