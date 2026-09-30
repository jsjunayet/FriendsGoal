import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DisbursementServices } from "./disbursement.service";

// 1. Get Member Profit Balance
const getMemberProfitBalance = catchAsync(
  async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const result = await DisbursementServices.getMemberProfitBalanceFromDB(
      memberId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Member profit balance retrieved successfully!",
      data: result,
    });
  }
);

// 2. Process Payout Transaction
const createDisbursement = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await DisbursementServices.createDisbursementInDB(
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Disbursement payout processed successfully!",
    data: result,
  });
});

// 3. Fetch Disbursements List
const getDisbursements = catchAsync(async (req: Request, res: Response) => {
  const result = await DisbursementServices.getDisbursementsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Disbursements retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const DisbursementControllers = {
  getMemberProfitBalance,
  createDisbursement,
  getDisbursements,
};
