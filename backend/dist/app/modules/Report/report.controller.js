"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const report_service_1 = require("./report.service");
const exportExpenseReport = (0, catchAsync_1.default)(async (req, res) => {
    await report_service_1.ReportServices.exportExpenseReport(res, req.query);
});
const exportInvestmentReport = (0, catchAsync_1.default)(async (req, res) => {
    await report_service_1.ReportServices.exportInvestmentReport(res, req.query);
});
const exportCollectionReport = (0, catchAsync_1.default)(async (req, res) => {
    await report_service_1.ReportServices.exportCollectionReport(res, req.query);
});
const exportAdjustmentReport = (0, catchAsync_1.default)(async (req, res) => {
    await report_service_1.ReportServices.exportAdjustmentReport(res, req.query);
});
exports.ReportControllers = {
    exportExpenseReport,
    exportInvestmentReport,
    exportCollectionReport,
    exportAdjustmentReport,
};
//# sourceMappingURL=report.controller.js.map