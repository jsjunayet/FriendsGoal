import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { InvestmentIncomeService } from "./investmentIncome.service";

const createInvestmentIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await InvestmentIncomeService.createInvestmentIncome(req.body, req.user?.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Investment income recorded and profit distributed successfully",
    data: result,
  });
});

const getInvestmentIncomes = catchAsync(async (req: Request, res: Response) => {
  const result = await InvestmentIncomeService.getInvestmentIncomes(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Investment incomes retrieved successfully",
    data: result,
  });
});

export const InvestmentIncomeControllers = {
  createInvestmentIncome,
  getInvestmentIncomes,
};
