"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const stats_service_1 = require("./stats.service");
const getAllStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await stats_service_1.StatService.getAllStatsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Stat counters retrieved successfully",
        data: result,
    });
});
const updateStat = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await stats_service_1.StatService.updateStatInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Stat counter updated successfully",
        data: result,
    });
});
const createStat = (0, catchAsync_1.default)(async (req, res) => {
    const result = await stats_service_1.StatService.createStatInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Stat counter created successfully",
        data: result,
    });
});
const bulkUpdateStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await stats_service_1.StatService.bulkUpsertStatsInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Stat counters updated successfully",
        data: result,
    });
});
exports.StatController = {
    getAllStats,
    updateStat,
    bulkUpdateStats,
    createStat,
};
//# sourceMappingURL=stats.controller.js.map