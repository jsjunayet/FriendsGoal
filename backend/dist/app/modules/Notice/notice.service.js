"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeService = void 0;
const notice_model_1 = require("./notice.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
function generateSlug(text) {
    if (!text)
        return `notice-${Date.now()}`;
    const slugified = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slugified ? `${slugified}-${Math.floor(1000 + Math.random() * 9000)}` : `notice-${Date.now()}`;
}
const createNoticeIntoDB = async (payload) => {
    if (!payload.slug) {
        payload.slug = generateSlug(payload.title?.en || payload.title?.bn);
    }
    const result = await notice_model_1.Notice.create(payload);
    return result;
};
const getAllNoticesFromDB = async (query) => {
    const filter = { isDeleted: false };
    if (query.isTickerActive === "true" || query.isTickerActive === true) {
        filter.isTickerActive = true;
    }
    const notices = await notice_model_1.Notice.find(filter).sort({ createdAt: -1 });
    return notices;
};
const getTickerNoticesFromDB = async () => {
    const notices = await notice_model_1.Notice.find({ isDeleted: false, isTickerActive: true }).sort({ updatedAt: -1 });
    return notices;
};
const getSingleNoticeFromDB = async (id) => {
    // Can search by _id or slug
    let notice = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        notice = await notice_model_1.Notice.findOne({ _id: id, isDeleted: false });
    }
    if (!notice) {
        notice = await notice_model_1.Notice.findOne({ slug: id, isDeleted: false });
    }
    if (!notice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice not found");
    }
    return notice;
};
const updateNoticeInDB = async (id, payload) => {
    const notice = await notice_model_1.Notice.findOne({ _id: id, isDeleted: false });
    if (!notice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice not found");
    }
    if (payload.title?.en && !payload.slug) {
        payload.slug = generateSlug(payload.title.en);
    }
    const result = await notice_model_1.Notice.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteNoticeFromDB = async (id) => {
    const notice = await notice_model_1.Notice.findOne({ _id: id, isDeleted: false });
    if (!notice) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice not found");
    }
    const result = await notice_model_1.Notice.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
};
exports.NoticeService = {
    createNoticeIntoDB,
    getAllNoticesFromDB,
    getTickerNoticesFromDB,
    getSingleNoticeFromDB,
    updateNoticeInDB,
    deleteNoticeFromDB,
};
//# sourceMappingURL=notice.service.js.map