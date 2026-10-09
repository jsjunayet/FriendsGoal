"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const gallery_model_1 = require("./gallery.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createGalleryItemIntoDB = async (payload) => {
    const result = await gallery_model_1.Gallery.create(payload);
    return result;
};
const getAllGalleryItemsFromDB = async (query) => {
    const filter = { isDeleted: false };
    if (query.category && typeof query.category === "string" && query.category !== "all") {
        filter.category = query.category;
    }
    const items = await gallery_model_1.Gallery.find(filter).sort({ createdAt: -1 });
    return items;
};
const getSingleGalleryItemFromDB = async (id) => {
    const item = await gallery_model_1.Gallery.findOne({ _id: id, isDeleted: false });
    if (!item) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Gallery item not found");
    }
    return item;
};
const updateGalleryItemInDB = async (id, payload) => {
    const item = await gallery_model_1.Gallery.findOne({ _id: id, isDeleted: false });
    if (!item) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Gallery item not found");
    }
    const result = await gallery_model_1.Gallery.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteGalleryItemFromDB = async (id) => {
    const item = await gallery_model_1.Gallery.findOne({ _id: id, isDeleted: false });
    if (!item) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Gallery item not found");
    }
    const result = await gallery_model_1.Gallery.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
};
exports.GalleryService = {
    createGalleryItemIntoDB,
    getAllGalleryItemsFromDB,
    getSingleGalleryItemFromDB,
    updateGalleryItemInDB,
    deleteGalleryItemFromDB,
};
//# sourceMappingURL=gallery.service.js.map