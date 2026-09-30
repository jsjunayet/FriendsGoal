import express from "express";
import { AuditLogControllers } from "./auditLog.controller";

const router = express.Router();

/**
 * 1. GET /api/v1/audit-logs
 * Fetch paginated system modification history / audit logs
 */
router.get("/", AuditLogControllers.getAuditLogs);

/**
 * 2. POST /api/v1/audit-logs
 * Record an audit log event
 */
router.post("/", AuditLogControllers.createAuditLog);

export const AuditLogRoutes = router;
