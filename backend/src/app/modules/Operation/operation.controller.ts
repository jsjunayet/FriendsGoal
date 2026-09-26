import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OperationServices } from "./operation.service";
import { generateDueListPdf } from "./pdfExporter.service";
import { generateDueListExcel } from "./excelExporter.service";

// 1. Get Due List (Paginated Receivables with Status Filters)
const getDueList = catchAsync(async (req: Request, res: Response) => {
  const result = await OperationServices.getDueListFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Due list retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 2. Get Collections (Top 10 Global or Member-Specific Chronology)
const getCollections = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.query.memberId as string | undefined;
  const result = await OperationServices.getCollectionsFromDB(memberId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Collections retrieved successfully!",
    data: result,
  });
});

// 3. Collect Payment
const collectPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await OperationServices.collectPaymentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment collected and recorded successfully!",
    data: result,
  });
});

// 4. Export PDF Report
const exportPdf = catchAsync(async (req: Request, res: Response) => {
  const items = await OperationServices.getFilteredDueListDataset(req.query);
  const status = (req.query.status as string) || "All";
  const search = (req.query.searchByCodeOrName as string) || "None";
  const filterSummary = `Status: ${status} | Search: ${search}`;

  const pdfBuffer = await generateDueListPdf(items, filterSummary);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="Due_List_Report.pdf"');
  res.setHeader("Content-Length", pdfBuffer.length);
  res.end(pdfBuffer);
});

// 5. Export Excel Workbook (.xlsx) — STRICT REQUIREMENT: NO CSV
const exportExcel = catchAsync(async (req: Request, res: Response) => {
  const items = await OperationServices.getFilteredDueListDataset(req.query);
  const status = (req.query.status as string) || "All";
  const search = (req.query.searchByCodeOrName as string) || "None";
  const filterSummary = `Status: ${status} | Search: ${search}`;

  const excelBuffer = await generateDueListExcel(items, filterSummary);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", 'attachment; filename="Due_List_Report.xlsx"');
  res.setHeader("Content-Length", excelBuffer.length);
  res.end(excelBuffer);
});

export const OperationControllers = {
  getDueList,
  getCollections,
  collectPayment,
  exportPdf,
  exportExcel,
};
