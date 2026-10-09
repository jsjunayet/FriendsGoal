"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const notice_service_1 = require("./notice.service");
const createNotice = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notice_service_1.NoticeService.createNoticeIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Notice created successfully",
        data: result,
    });
});
const getAllNotices = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notice_service_1.NoticeService.getAllNoticesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notices retrieved successfully",
        data: result,
    });
});
const getTickerNotices = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notice_service_1.NoticeService.getTickerNoticesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Ticker notices retrieved successfully",
        data: result,
    });
});
const getSingleNotice = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await notice_service_1.NoticeService.getSingleNoticeFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice retrieved successfully",
        data: result,
    });
});
const updateNotice = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await notice_service_1.NoticeService.updateNoticeInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice updated successfully",
        data: result,
    });
});
const deleteNotice = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await notice_service_1.NoticeService.deleteNoticeFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice deleted successfully",
        data: result,
    });
});
exports.NoticeController = {
    createNotice,
    getAllNotices,
    getTickerNotices,
    getSingleNotice,
    updateNotice,
    deleteNotice,
};
//# sourceMappingURL=notice.controller.js.map