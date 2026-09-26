import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdjustmentServices } from "./adjustment.service";

// 1. Create Money Adjustment
const createAdjustment = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await AdjustmentServices.createAdjustmentInDB(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Adjustment processed and ledger balances updated successfully!",
    data: result,
  });
});

// 2. Get Filtered Adjustments
const getAdjustments = catchAsync(async (req: Request, res: Response) => {
  const result = await AdjustmentServices.getAdjustmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Adjustments retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 3. Get Single Adjustment
const getSingleAdjustment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdjustmentServices.getSingleAdjustmentFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Adjustment details retrieved successfully!",
    data: result,
  });
});

export const AdjustmentControllers = {
  createAdjustment,
  getAdjustments,
  getSingleAdjustment,
};
