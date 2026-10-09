"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFormServices = exports.extractEmbedUrl = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const googleForm_model_1 = require("./googleForm.model");
/**
 * Extracts iframe src or returns clean URL
 */
const extractEmbedUrl = (input) => {
    if (!input)
        return "";
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
exports.extractEmbedUrl = extractEmbedUrl;
const createGoogleFormInDB = async (payload) => {
    const cleanUrl = (0, exports.extractEmbedUrl)(payload.embedUrl);
    const result = await googleForm_model_1.GoogleForm.create({
        ...payload,
        rawInput: payload.embedUrl,
        embedUrl: cleanUrl,
    });
    return result;
};
const getAllGoogleFormsFromDB = async (query) => {
    const filter = { isDeleted: false };
    if (query.status && query.status !== "All") {
        filter.status = query.status;
    }
    if (query.search) {
        const searchRegex = new RegExp(String(query.search).trim(), "i");
        filter.title = { $regex: searchRegex };
    }
    const result = await googleForm_model_1.GoogleForm.find(filter).sort({ createdAt: -1 });
    return result;
};
const getSingleGoogleFormFromDB = async (id) => {
    const result = await googleForm_model_1.GoogleForm.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Google Form record not found");
    }
    return result;
};
const updateGoogleFormInDB = async (id, payload) => {
    const updateData = { ...payload };
    if (payload.embedUrl) {
        updateData.rawInput = payload.embedUrl;
        updateData.embedUrl = (0, exports.extractEmbedUrl)(payload.embedUrl);
    }
    const result = await googleForm_model_1.GoogleForm.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Google Form record not found");
    }
    return result;
};
const deleteGoogleFormFromDB = async (id) => {
    const result = await googleForm_model_1.GoogleForm.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Google Form record not found");
    }
    return result;
};
exports.GoogleFormServices = {
    createGoogleFormInDB,
    getAllGoogleFormsFromDB,
    getSingleGoogleFormFromDB,
    updateGoogleFormInDB,
    deleteGoogleFormFromDB,
};
//# sourceMappingURL=googleForm.service.js.map