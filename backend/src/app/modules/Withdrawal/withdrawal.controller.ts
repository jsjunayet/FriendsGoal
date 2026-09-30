import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WithdrawalServices } from "./withdrawal.service";

// 1. Submit Withdrawal Request
const createWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const result = await WithdrawalServices.createWithdrawalRequestInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdrawal request submitted successfully! Status is Pending.",
    data: result,
  });
});

// 2. Fetch Withdrawal Requests
const getWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const result = await WithdrawalServices.getWithdrawalsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdrawal requests retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 3. Admin Respond: Approve / Reject Withdrawal Request
const respondWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await WithdrawalServices.respondWithdrawalInDB(
    id,
    req.body,
    (req as any).user
  );

  const actionText =
    req.body.action === "approve" || req.body.action === "Approved"
      ? "approved"
      : "rejected";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Withdrawal request successfully ${actionText}!`,
    data: result,
  });
});

export const WithdrawalControllers = {
  createWithdrawal,
  getWithdrawals,
  respondWithdrawal,
};
