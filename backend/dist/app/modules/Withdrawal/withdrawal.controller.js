"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const withdrawal_service_1 = require("./withdrawal.service");
// 1. Submit Withdrawal Request
const createWithdrawal = (0, catchAsync_1.default)(async (req, res) => {
    const result = await withdrawal_service_1.WithdrawalServices.createWithdrawalRequestInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Withdrawal request submitted successfully! Status is Pending.",
        data: result,
    });
});
// 2. Fetch Withdrawal Requests
const getWithdrawals = (0, catchAsync_1.default)(async (req, res) => {
    const result = await withdrawal_service_1.WithdrawalServices.getWithdrawalsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdrawal requests retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
// 3. Admin Respond: Approve / Reject Withdrawal Request
const respondWithdrawal = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await withdrawal_service_1.WithdrawalServices.respondWithdrawalInDB(id, req.body, req.user);
    const actionText = req.body.action === "approve" || req.body.action === "Approved"
        ? "approved"
        : "rejected";
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Withdrawal request successfully ${actionText}!`,
        data: result,
    });
});
exports.WithdrawalControllers = {
    createWithdrawal,
    getWithdrawals,
    respondWithdrawal,
};
//# sourceMappingURL=withdrawal.controller.js.map