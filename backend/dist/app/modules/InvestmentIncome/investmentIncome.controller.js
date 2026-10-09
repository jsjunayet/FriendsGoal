"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentIncomeControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const investmentIncome_service_1 = require("./investmentIncome.service");
const createInvestmentIncome = (0, catchAsync_1.default)(async (req, res) => {
    const result = await investmentIncome_service_1.InvestmentIncomeService.createInvestmentIncome(req.body, req.user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Investment income recorded and profit distributed successfully",
        data: result,
    });
});
const getInvestmentIncomes = (0, catchAsync_1.default)(async (req, res) => {
    const result = await investmentIncome_service_1.InvestmentIncomeService.getInvestmentIncomes(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Investment incomes retrieved successfully",
        data: result,
    });
});
exports.InvestmentIncomeControllers = {
    createInvestmentIncome,
    getInvestmentIncomes,
};
//# sourceMappingURL=investmentIncome.controller.js.map