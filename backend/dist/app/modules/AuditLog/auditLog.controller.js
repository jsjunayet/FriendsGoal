"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auditLog_service_1 = require("./auditLog.service");
const createAuditLog = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auditLog_service_1.AuditLogServices.createAuditLogInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Audit log entry created successfully!",
        data: result,
    });
});
const getAuditLogs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auditLog_service_1.AuditLogServices.getAuditLogsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Audit logs retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
});
exports.AuditLogControllers = {
    createAuditLog,
    getAuditLogs,
};
//# sourceMappingURL=auditLog.controller.js.map