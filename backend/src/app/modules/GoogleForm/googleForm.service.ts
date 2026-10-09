import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import type { IGoogleForm } from "./googleForm.interface";
import { GoogleForm } from "./googleForm.model";

/**
 * Extracts iframe src or returns clean URL
 */
export const extractEmbedUrl = (input: string): string => {
  if (!input) return "";
  let trimmed = input.trim();

  // If iframe tag passed, extract src
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1].trim();
  }

  // If standard Google Form link
  if (trimmed.includes("docs.google.com/forms")) {
    // Replace editor path (/edit, /edit?usp=sharing, /edit#responses, etc.) with /viewform
    trimmed = trimmed.replace(/\/edit(\?[^#]*)?(#.*)?$/i, "/viewform");
    trimmed = trimmed.replace(/\/edit\/.*$/i, "/viewform");

    // Remove any edit_requested parameters
    trimmed = trimmed.replace(/([?&])edit_requested=[^&]*(&|$)/i, "$1").replace(/[?&]$/, "");

    // Ensure it targets /viewform if it was missing
    if (!trimmed.includes("/viewform")) {
      trimmed = trimmed.replace(/\/+$/, "") + "/viewform";
    }

    // Ensure embedded=true parameter exists for iframe rendering
    if (!trimmed.includes("embedded=true")) {
      trimmed = `${trimmed}${trimmed.includes("?") ? "&" : "?"}embedded=true`;
    }

    return trimmed;
  }

  // If shortened forms.gle link
  if (trimmed.includes("forms.gle")) {
    if (!trimmed.includes("embedded=true")) {
      trimmed = `${trimmed}${trimmed.includes("?") ? "&" : "?"}embedded=true`;
    }
    return trimmed;
  }

  return trimmed;
};

const createGoogleFormInDB = async (payload: IGoogleForm) => {
  const cleanUrl = extractEmbedUrl(payload.embedUrl);
  const result = await GoogleForm.create({
    ...payload,
    rawInput: payload.embedUrl,
    embedUrl: cleanUrl,
  });
  return result;
};

const getAllGoogleFormsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }
  if (query.search) {
    const searchRegex = new RegExp(String(query.search).trim(), "i");
    filter.title = { $regex: searchRegex };
  }

  const result = await GoogleForm.find(filter).sort({ createdAt: -1 });
  return result;
};

const getSingleGoogleFormFromDB = async (id: string) => {
  const result = await GoogleForm.findOne({ _id: id, isDeleted: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Google Form record not found");
  }
  return result;
};

const updateGoogleFormInDB = async (
  id: string,
  payload: Partial<IGoogleForm>
) => {
  const updateData = { ...payload };
  if (payload.embedUrl) {
    updateData.rawInput = payload.embedUrl;
    updateData.embedUrl = extractEmbedUrl(payload.embedUrl);
  }

  const result = await GoogleForm.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Google Form record not found");
  }

  return result;
};

const deleteGoogleFormFromDB = async (id: string) => {
  const result = await GoogleForm.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Google Form record not found");
  }

  return result;
};

export const GoogleFormServices = {
  createGoogleFormInDB,
  getAllGoogleFormsFromDB,
  getSingleGoogleFormFromDB,
  updateGoogleFormInDB,
  deleteGoogleFormFromDB,
};
