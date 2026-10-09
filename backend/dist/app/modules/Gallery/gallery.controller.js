"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const gallery_service_1 = require("./gallery.service");
const createGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.createGalleryItemIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Gallery item created successfully",
        data: result,
    });
});
const getAllGalleryItems = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_service_1.GalleryService.getAllGalleryItemsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery items retrieved successfully",
        data: result,
    });
});
const getSingleGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await gallery_service_1.GalleryService.getSingleGalleryItemFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery item retrieved successfully",
        data: result,
    });
});
const updateGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await gallery_service_1.GalleryService.updateGalleryItemInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery item updated successfully",
        data: result,
    });
});
const deleteGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await gallery_service_1.GalleryService.deleteGalleryItemFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gallery item deleted successfully",
        data: result,
    });
});
exports.GalleryController = {
    createGalleryItem,
    getAllGalleryItems,
    getSingleGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
};
//# sourceMappingURL=gallery.controller.js.map