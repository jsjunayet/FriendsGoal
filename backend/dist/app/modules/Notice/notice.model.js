"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = void 0;
const mongoose_1 = require("mongoose");
const agendaItemSchema = new mongoose_1.Schema({
    num: { type: Number },
    title: {
        bn: { type: String, default: "", trim: true },
        en: { type: String, default: "", trim: true },
    },
    text: {
        bn: { type: String, default: "", trim: true },
        en: { type: String, default: "", trim: true },
    },
}, { _id: false });
const noticeSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: "__v",
});
noticeSchema.index({ isDeleted: 1, createdAt: -1 });
noticeSchema.index({ isTickerActive: 1 });
exports.Notice = (0, mongoose_1.model)("Notice", noticeSchema);
//# sourceMappingURL=notice.model.js.map