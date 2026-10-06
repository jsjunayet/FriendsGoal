import { Schema, model } from "mongoose";
import type { IGalleryItem, GalleryModel } from "./gallery.interface";

const gallerySchema = new Schema<IGalleryItem, GalleryModel>(
  {
    title: {
      bn: { type: String, required: [true, "Bangla title is required"], trim: true },
      en: { type: String, required: [true, "English title is required"], trim: true },
    },
    subtitle: {
      bn: { type: String, default: "", trim: true },
      en: { type: String, default: "", trim: true },
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "general",
      trim: true,
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

gallerySchema.index({ isDeleted: 1, category: 1, createdAt: -1 });

export const Gallery = model<IGalleryItem, GalleryModel>("Gallery", gallerySchema);
