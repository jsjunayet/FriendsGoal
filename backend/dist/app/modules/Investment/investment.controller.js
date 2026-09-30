"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const investment_service_1 = require("./investment.service");
// 1. Create Investment
const createInvestment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const result = await investment_service_1.InvestmentServices.createInvestmentInDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Investment created successfully!",
        data: result,
    });
});
// 2. Get All Investments (with Search & Pagination)
const getInvestments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await investment_service_1.InvestmentServices.getInvestmentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investments retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
// 3. Get Single Investment
const getSingleInvestment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await investment_service_1.InvestmentServices.getSingleInvestmentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investment retrieved successfully!",
        data: result,
    });
});
// 4. Close Investment
const closeInvestment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await investment_service_1.InvestmentServices.closeInvestmentInDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investment closed successfully! End date recorded.",
        data: result,
    });
});
// 5. Update Investment
const updateInvestment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await investment_service_1.InvestmentServices.updateInvestmentInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investment updated successfully!",
        data: result,
    });
});
// 6. Delete Investment
const deleteInvestment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await investment_service_1.InvestmentServices.deleteInvestmentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investment deleted successfully!",
        data: result,
    });
});
exports.InvestmentControllers = {
    createInvestment,
    getInvestments,
    getSingleInvestment,
    closeInvestment,
    updateInvestment,
    deleteInvestment,
};
//# sourceMappingURL=investment.controller.js.map