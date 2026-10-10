"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const operation_service_1 = require("./operation.service");
const pdfExporter_service_1 = require("./pdfExporter.service");
const excelExporter_service_1 = require("./excelExporter.service");
// 1. Get Due List (Paginated Receivables with Status Filters)
const getDueList = (0, catchAsync_1.default)(async (req, res) => {
    const result = await operation_service_1.OperationServices.getDueListFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Due list retrieved successfully!",
        meta: result.meta,
        counts: {
            total: result.meta.allCount ?? result.meta.total ?? 0,
            advance: result.meta.advanceCount ?? 0,
            due: result.meta.dueCount ?? 0,
            zero: result.meta.zeroCount ?? 0,
        },
        data: result.data,
    });
});
// 2. Get Collections (Top 10 Global or Member-Specific Chronology)
const getCollections = (0, catchAsync_1.default)(async (req, res) => {
    const memberId = req.query.memberId;
    const result = await operation_service_1.OperationServices.getCollectionsFromDB(memberId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Collections retrieved successfully!",
        data: result,
    });
});
// 3. Collect Payment
const collectPayment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await operation_service_1.OperationServices.collectPaymentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Payment collected and recorded successfully!",
        data: result,
    });
});
// 4. Export PDF Report
const exportPdf = (0, catchAsync_1.default)(async (req, res) => {
    const items = await operation_service_1.OperationServices.getFilteredDueListDataset(req.query);
    const status = req.query.status || "All";
    const search = req.query.searchByCodeOrName || "None";
    const filterSummary = `Status: ${status} | Search: ${search}`;
    const pdfBuffer = await (0, pdfExporter_service_1.generateDueListPdf)(items, filterSummary);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Due_List_Report.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length);
    res.end(pdfBuffer);
});
// 5. Export Excel Workbook (.xlsx) — STRICT REQUIREMENT: NO CSV
const exportExcel = (0, catchAsync_1.default)(async (req, res) => {
    const items = await operation_service_1.OperationServices.getFilteredDueListDataset(req.query);
    const status = req.query.status || "All";
    const search = req.query.searchByCodeOrName || "None";
    const filterSummary = `Status: ${status} | Search: ${search}`;
    const excelBuffer = await (0, excelExporter_service_1.generateDueListExcel)(items, filterSummary);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="Due_List_Report.xlsx"');
    res.setHeader("Content-Length", excelBuffer.length);
    res.end(excelBuffer);
});
exports.OperationControllers = {
    getDueList,
    getCollections,
    collectPayment,
    exportPdf,
    exportExcel,
};
//# sourceMappingURL=operation.controller.js.map