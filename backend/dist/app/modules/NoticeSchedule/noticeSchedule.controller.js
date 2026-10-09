"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeScheduleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const noticeSchedule_service_1 = require("./noticeSchedule.service");
const createNoticeSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await noticeSchedule_service_1.NoticeScheduleServices.createNoticeScheduleInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Notice schedule published successfully!",
        data: result,
    });
});
const getAllNoticeSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await noticeSchedule_service_1.NoticeScheduleServices.getAllNoticeSchedulesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice schedules retrieved successfully!",
        data: result,
    });
});
const getSingleNoticeSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await noticeSchedule_service_1.NoticeScheduleServices.getSingleNoticeScheduleFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice schedule retrieved successfully!",
        data: result,
    });
});
const updateNoticeSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await noticeSchedule_service_1.NoticeScheduleServices.updateNoticeScheduleInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice schedule updated successfully!",
        data: result,
    });
});
const deleteNoticeSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await noticeSchedule_service_1.NoticeScheduleServices.deleteNoticeScheduleFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notice schedule deleted successfully!",
        data: result,
    });
});
exports.NoticeScheduleControllers = {
    createNoticeSchedule,
    getAllNoticeSchedules,
    getSingleNoticeSchedule,
    updateNoticeSchedule,
    deleteNoticeSchedule,
};
//# sourceMappingURL=noticeSchedule.controller.js.map