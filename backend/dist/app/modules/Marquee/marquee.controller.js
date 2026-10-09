"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarqueeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const marquee_service_1 = require("./marquee.service");
const getActiveMarqueeItems = (0, catchAsync_1.default)(async (req, res) => {
    const result = await marquee_service_1.MarqueeServices.getActiveMarqueeItemsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active marquee ticker items retrieved successfully",
        data: result,
    });
});
const getAllMarqueeItems = (0, catchAsync_1.default)(async (req, res) => {
    const onlyActive = req.query.active === "true";
    const result = await marquee_service_1.MarqueeServices.getAllMarqueeItemsFromDB(onlyActive);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Marquee ticker items retrieved successfully",
        data: result,
    });
});
const createMarqueeItem = (0, catchAsync_1.default)(async (req, res) => {
    const result = await marquee_service_1.MarqueeServices.createMarqueeItemIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Marquee ticker item created successfully",
        data: result,
    });
});
const updateMarqueeItem = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await marquee_service_1.MarqueeServices.updateMarqueeItemInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Marquee ticker item updated successfully",
        data: result,
    });
});
const deleteMarqueeItem = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await marquee_service_1.MarqueeServices.deleteMarqueeItemFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Marquee ticker item deleted successfully",
        data: result,
    });
});
exports.MarqueeControllers = {
    getActiveMarqueeItems,
    getAllMarqueeItems,
    createMarqueeItem,
    updateMarqueeItem,
    deleteMarqueeItem,
};
//# sourceMappingURL=marquee.controller.js.map