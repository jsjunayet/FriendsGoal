"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const disbursement_service_1 = require("./disbursement.service");
// 1. Get Member Profit Balance
const getMemberProfitBalance = (0, catchAsync_1.default)(async (req, res) => {
    const { memberId } = req.params;
    const result = await disbursement_service_1.DisbursementServices.getMemberProfitBalanceFromDB(memberId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Member profit balance retrieved successfully!",
        data: result,
    });
});
// 2. Process Payout Transaction
const createDisbursement = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const result = await disbursement_service_1.DisbursementServices.createDisbursementInDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Disbursement payout processed successfully!",
        data: result,
    });
});
// 3. Fetch Disbursements List
const getDisbursements = (0, catchAsync_1.default)(async (req, res) => {
    const result = await disbursement_service_1.DisbursementServices.getDisbursementsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Disbursements retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
exports.DisbursementControllers = {
    getMemberProfitBalance,
    createDisbursement,
    getDisbursements,
};
//# sourceMappingURL=disbursement.controller.js.map