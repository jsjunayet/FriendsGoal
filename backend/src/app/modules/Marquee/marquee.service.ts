import { IMarqueeItem } from "./marquee.interface";
import { Marquee } from "./marquee.model";

const getActiveMarqueeItemsFromDB = async () => {
  return await Marquee.find({ isActive: true }).sort({ priority: -1, createdAt: -1 });
};

const getAllMarqueeItemsFromDB = async (onlyActive = false) => {
  const query = onlyActive ? { isActive: true } : {};
  return await Marquee.find(query).sort({ priority: -1, createdAt: -1 });
};

const createMarqueeItemIntoDB = async (payload: any) => {
  const data: Partial<IMarqueeItem> = {
    headline: payload.headline || payload.text,
    targetLink: payload.targetLink !== undefined ? payload.targetLink : payload.link || "",
    isActive: payload.isActive !== undefined ? payload.isActive : false,
    priority: payload.priority || 0,
  };

  const result = await Marquee.create(data);
  return result;
};

const updateMarqueeItemInDB = async (id: string, payload: any) => {
  const updateData: Record<string, any> = {};

  if (payload.headline) updateData.headline = payload.headline;
  if (payload.text) updateData.headline = payload.text;
  if (payload.targetLink !== undefined) updateData.targetLink = payload.targetLink;
  if (payload.link !== undefined && payload.targetLink === undefined) updateData.targetLink = payload.link;
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.priority !== undefined) updateData.priority = payload.priority;

  const result = await Marquee.findByIdAndUpdate(id, updateData, { new: true });
  return result;
};

const deleteMarqueeItemFromDB = async (id: string) => {
  const result = await Marquee.findByIdAndDelete(id);
  return result;
};

export const MarqueeServices = {
  getActiveMarqueeItemsFromDB,
  getAllMarqueeItemsFromDB,
  createMarqueeItemIntoDB,
  updateMarqueeItemInDB,
  deleteMarqueeItemFromDB,
};
