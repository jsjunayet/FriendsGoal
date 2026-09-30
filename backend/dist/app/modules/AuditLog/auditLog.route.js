"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auditLog_controller_1 = require("./auditLog.controller");
const router = express_1.default.Router();
/**
 * 1. GET /api/v1/audit-logs
 * Fetch paginated system modification history / audit logs
 */
router.get("/", auditLog_controller_1.AuditLogControllers.getAuditLogs);
/**
 * 2. POST /api/v1/audit-logs
 * Record an audit log event
 */
router.post("/", auditLog_controller_1.AuditLogControllers.createAuditLog);
exports.AuditLogRoutes = router;
//# sourceMappingURL=auditLog.route.js.map