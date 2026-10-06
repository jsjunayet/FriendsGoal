import { Notice } from "./notice.model";
import type { INotice } from "./notice.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

function generateSlug(text?: string): string {
  if (!text) return `notice-${Date.now()}`;
  const slugified = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slugified ? `${slugified}-${Math.floor(1000 + Math.random() * 9000)}` : `notice-${Date.now()}`;
}

const createNoticeIntoDB = async (payload: INotice) => {
  if (!payload.slug) {
    payload.slug = generateSlug(payload.title?.en || payload.title?.bn);
  }
  const result = await Notice.create(payload);
  return result;
};

const getAllNoticesFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (query.isTickerActive === "true" || query.isTickerActive === true) {
    filter.isTickerActive = true;
  }
  const notices = await Notice.find(filter).sort({ createdAt: -1 });
  return notices;
};

const getTickerNoticesFromDB = async () => {
  const notices = await Notice.find({ isDeleted: false, isTickerActive: true }).sort({ updatedAt: -1 });
  return notices;
};

const getSingleNoticeFromDB = async (id: string) => {
  // Can search by _id or slug
  let notice = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    notice = await Notice.findOne({ _id: id, isDeleted: false });
  }
  if (!notice) {
    notice = await Notice.findOne({ slug: id, isDeleted: false });
  }
  if (!notice) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice not found");
  }
  return notice;
};

const updateNoticeInDB = async (id: string, payload: Partial<INotice>) => {
  const notice = await Notice.findOne({ _id: id, isDeleted: false });
  if (!notice) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice not found");
  }

  if (payload.title?.en && !payload.slug) {
    payload.slug = generateSlug(payload.title.en);
  }

  const result = await Notice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteNoticeFromDB = async (id: string) => {
  const notice = await Notice.findOne({ _id: id, isDeleted: false });
  if (!notice) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice not found");
  }

  const result = await Notice.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const NoticeService = {
  createNoticeIntoDB,
  getAllNoticesFromDB,
  getTickerNoticesFromDB,
  getSingleNoticeFromDB,
  updateNoticeInDB,
  deleteNoticeFromDB,
};
