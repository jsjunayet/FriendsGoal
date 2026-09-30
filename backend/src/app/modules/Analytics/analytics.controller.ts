import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getOverviewFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Overview fetched successfully",
    data: result,
  });
});

const getMonthlyCollections = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getMonthlyCollectionsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly collections fetched successfully",
    data: result,
  });
});

export const AnalyticsControllers = {
  getOverview,
  getMonthlyCollections,
};
