import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ReportServices } from "./report.service";

const exportExpenseReport = catchAsync(async (req: Request, res: Response) => {
  await ReportServices.exportExpenseReport(res, req.query);
});

const exportInvestmentReport = catchAsync(async (req: Request, res: Response) => {
  await ReportServices.exportInvestmentReport(res, req.query);
});

const exportCollectionReport = catchAsync(async (req: Request, res: Response) => {
  await ReportServices.exportCollectionReport(res, req.query);
});

const exportAdjustmentReport = catchAsync(async (req: Request, res: Response) => {
  await ReportServices.exportAdjustmentReport(res, req.query);
});

export const ReportControllers = {
  exportExpenseReport,
  exportInvestmentReport,
  exportCollectionReport,
  exportAdjustmentReport,
};
