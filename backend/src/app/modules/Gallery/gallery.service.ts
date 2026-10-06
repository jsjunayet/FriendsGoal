import { Gallery } from "./gallery.model";
import type { IGalleryItem } from "./gallery.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createGalleryItemIntoDB = async (payload: IGalleryItem) => {
  const result = await Gallery.create(payload);
  return result;
};

const getAllGalleryItemsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (query.category && typeof query.category === "string" && query.category !== "all") {
    filter.category = query.category;
  }
  const items = await Gallery.find(filter).sort({ createdAt: -1 });
  return items;
};

const getSingleGalleryItemFromDB = async (id: string) => {
  const item = await Gallery.findOne({ _id: id, isDeleted: false });
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Gallery item not found");
  }
  return item;
};

const updateGalleryItemInDB = async (id: string, payload: Partial<IGalleryItem>) => {
  const item = await Gallery.findOne({ _id: id, isDeleted: false });
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Gallery item not found");
  }
  const result = await Gallery.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteGalleryItemFromDB = async (id: string) => {
  const item = await Gallery.findOne({ _id: id, isDeleted: false });
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Gallery item not found");
  }
  const result = await Gallery.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const GalleryService = {
  createGalleryItemIntoDB,
  getAllGalleryItemsFromDB,
  getSingleGalleryItemFromDB,
  updateGalleryItemInDB,
  deleteGalleryItemFromDB,
};
