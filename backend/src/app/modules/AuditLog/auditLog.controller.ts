import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuditLogServices } from "./auditLog.service";

const createAuditLog = catchAsync(async (req: Request, res: Response) => {
  const result = await AuditLogServices.createAuditLogInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Audit log entry created successfully!",
    data: result,
  });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await AuditLogServices.getAuditLogsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Audit logs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const AuditLogControllers = {
  createAuditLog,
  getAuditLogs,
};
