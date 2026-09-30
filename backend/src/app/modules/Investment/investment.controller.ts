import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { InvestmentServices } from "./investment.service";

// 1. Create Investment
const createInvestment = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await InvestmentServices.createInvestmentInDB(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Investment created successfully!",
    data: result,
  });
});

// 2. Get All Investments (with Search & Pagination)
const getInvestments = catchAsync(async (req: Request, res: Response) => {
  const result = await InvestmentServices.getInvestmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investments retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 3. Get Single Investment
const getSingleInvestment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvestmentServices.getSingleInvestmentFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investment retrieved successfully!",
    data: result,
  });
});

// 4. Close Investment
const closeInvestment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvestmentServices.closeInvestmentInDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investment closed successfully! End date recorded.",
    data: result,
  });
});

// 5. Update Investment
const updateInvestment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvestmentServices.updateInvestmentInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investment updated successfully!",
    data: result,
  });
});

// 6. Delete Investment
const deleteInvestment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvestmentServices.deleteInvestmentFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investment deleted successfully!",
    data: result,
  });
});

export const InvestmentControllers = {
  createInvestment,
  getInvestments,
  getSingleInvestment,
  closeInvestment,
  updateInvestment,
  deleteInvestment,
};
