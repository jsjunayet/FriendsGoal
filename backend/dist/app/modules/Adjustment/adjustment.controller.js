"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const adjustment_service_1 = require("./adjustment.service");
// 1. Create Money Adjustment
const createAdjustment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const result = await adjustment_service_1.AdjustmentServices.createAdjustmentInDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Adjustment processed and ledger balances updated successfully!",
        data: result,
    });
});
// 2. Get Filtered Adjustments
const getAdjustments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await adjustment_service_1.AdjustmentServices.getAdjustmentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Adjustments retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
// 3. Get Single Adjustment
const getSingleAdjustment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await adjustment_service_1.AdjustmentServices.getSingleAdjustmentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Adjustment details retrieved successfully!",
        data: result,
    });
});
exports.AdjustmentControllers = {
    createAdjustment,
    getAdjustments,
    getSingleAdjustment,
};
//# sourceMappingURL=adjustment.controller.js.map