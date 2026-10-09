"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const mongoose_1 = require("mongoose");
const gallerySchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: "__v",
});
gallerySchema.index({ isDeleted: 1, category: 1, createdAt: -1 });
exports.Gallery = (0, mongoose_1.model)("Gallery", gallerySchema);
//# sourceMappingURL=gallery.model.js.map