import type { Response } from "express";
import { Expense } from "../Expense/expense.model";
import { Investment } from "../Investment/investment.model";
import { Collection } from "../Operation/operation.model";
import { Adjustment } from "../Adjustment/adjustment.model";
import { streamReportToPdf, IPdfColumnConfig } from "../../services/reportPdfStream.service";
import { streamReportToExcel, IExcelColumnConfig } from "../../services/reportExcelStream.service";
import type {
  IExpenseReportExportQuery,
  IInvestmentReportExportQuery,
  ICollectionReportExportQuery,
  IAdjustmentReportExportQuery,
} from "./report.interface";

/**
 * Format date range helper for report metadata
 */
function buildDateRangeSummary(fromDate?: string, toDate?: string): string {
  if (fromDate && toDate) return `${fromDate} to ${toDate}`;
  if (fromDate) return `From ${fromDate}`;
  if (toDate) return `Up to ${toDate}`;
  return "All Records (Leave Blank to Show All)";
}

/**
 * Build Mongoose date range filter
 */
function buildDateFilter(fieldName: string, fromDate?: string, toDate?: string): Record<string, any> {
  const filter: Record<string, any> = {};
  if (fromDate || toDate) {
    filter[fieldName] = {};
    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      filter[fieldName].$gte = start;
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filter[fieldName].$lte = end;
    }
  }
  return filter;
}

/**
 * 1. Export Expense Report (PDF / Excel)
 * Matching Screenshot 1: ID | MEMBER | CATEGORY | DATE | AMOUNT | REMARKS
 */
async function exportExpenseReport(res: Response, query: IExpenseReportExportQuery): Promise<void> {
  const format = (query.format || "pdf").toLowerCase();
  const dateFilter = buildDateFilter("expenseDate", query.fromDate, query.toDate);
  const filter = { isDeleted: false, ...dateFilter };

  // Calculate high-level KPIs for metadata
  const [summary] = await Expense.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRecords = summary?.count || 0;
  const totalAmount = summary?.totalAmount || 0;
  const filtersSummary = buildDateRangeSummary(query.fromDate, query.toDate);
  const timestamp = new Date().toISOString().slice(0, 10);

  // MongoDB batching cursor: zero memory leak
  const cursor = Expense.find(filter)
    .sort({ expenseDate: -1, expenseId: -1 })
    .lean()
    .cursor();

  if (format === "excel") {
    const columns: IExcelColumnConfig[] = [
      { header: "ID", key: "expenseId", width: 10, alignment: "center" },
      { header: "MEMBER", key: "memberName", width: 25 },
      { header: "CATEGORY", key: "expenseHead", width: 22 },
      { header: "DATE", key: "expenseDate", width: 15, alignment: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 18, alignment: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 35 },
    ];

    await streamReportToExcel(res, {
      filename: `expense-report-${timestamp}.xlsx`,
      sheetName: "Expense Report",
      reportTitle: "EXPENSE REPORT",
      metadata: {
        "Filter Period": filtersSummary,
        "Total Records": totalRecords,
        "Total Amount": `BDT ${totalAmount.toLocaleString()}`,
      },
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["amount"],
    });
  } else {
    const columns: IPdfColumnConfig[] = [
      { header: "ID", key: "expenseId", width: 35, align: "center" },
      { header: "MEMBER", key: "memberName", width: 120 },
      { header: "CATEGORY", key: "expenseHead", width: 95 },
      { header: "DATE", key: "expenseDate", width: 65, align: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 75, align: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 133 },
    ];

    await streamReportToPdf(res, {
      filename: `expense-report-${timestamp}.pdf`,
      reportTitle: "Expense Report",
      filtersSummary,
      kpis: [
        { label: "Total Records", value: totalRecords },
        { label: "Total Amount", value: `BDT ${totalAmount.toLocaleString()}` },
      ],
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["amount"],
      grandTotalLabel: "Total Expense",
    });
  }
}

/**
 * 2. Export Investment Income Report (PDF / Excel)
 * Matching Screenshot 2: ID | INVESTMENT NAME | DATE | AMOUNT | REMARKS
 */
async function exportInvestmentReport(
  res: Response,
  query: IInvestmentReportExportQuery
): Promise<void> {
  const format = (query.format || "pdf").toLowerCase();
  const dateFilter = buildDateFilter("startDate", query.fromDate, query.toDate);
  const filter = { isDeleted: false, ...dateFilter };

  const [summary] = await Investment.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRecords = summary?.count || 0;
  const totalAmount = summary?.totalAmount || 0;
  const filtersSummary = buildDateRangeSummary(query.fromDate, query.toDate);
  const timestamp = new Date().toISOString().slice(0, 10);

  const cursor = Investment.find(filter)
    .sort({ numericId: 1 })
    .lean()
    .cursor();

  if (format === "excel") {
    const columns: IExcelColumnConfig[] = [
      { header: "ID", key: "numericId", width: 10, alignment: "center" },
      { header: "INVESTMENT NAME", key: "name", width: 28 },
      { header: "DATE", key: "startDate", width: 15, alignment: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 18, alignment: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 35 },
    ];

    await streamReportToExcel(res, {
      filename: `investments-income-report-${timestamp}.xlsx`,
      sheetName: "Investments Income",
      reportTitle: "INVESTMENTS INCOME REPORT",
      metadata: {
        "Filter Period": filtersSummary,
        "Total Records": totalRecords,
        "Total Income": `BDT ${totalAmount.toLocaleString()}`,
      },
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["amount"],
    });
  } else {
    const columns: IPdfColumnConfig[] = [
      { header: "ID", key: "numericId", width: 35, align: "center" },
      { header: "INVESTMENT NAME", key: "name", width: 155 },
      { header: "DATE", key: "startDate", width: 75, align: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 85, align: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 173 },
    ];

    await streamReportToPdf(res, {
      filename: `investments-income-report-${timestamp}.pdf`,
      reportTitle: "Investments Income Report",
      filtersSummary,
      kpis: [
        { label: "Total Income", value: `BDT ${totalAmount.toLocaleString()}` },
        { label: "Records", value: totalRecords },
      ],
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["amount"],
      grandTotalLabel: "Total Income",
    });
  }
}

/**
 * 3. Export Collection Report (PDF / Excel)
 * Matching Screenshot 3: ID | MEMBER NAME | COLLECTION DATE | AMOUNT COLLECTED | REMARKS
 */
async function exportCollectionReport(
  res: Response,
  query: ICollectionReportExportQuery
): Promise<void> {
  const format = (query.format || "pdf").toLowerCase();
  const dateFilter = buildDateFilter("paymentDate", query.fromDate, query.toDate);
  const filter = { ...dateFilter };

  const [summary] = await Collection.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalCollected: { $sum: "$amount" },
        count: { $sum: 1 },
        distinctMembers: { $addToSet: "$member" },
      },
    },
  ]);

  const totalCollected = summary?.totalCollected || 0;
  const noOfPayments = summary?.count || 0;
  const membersPaid = summary?.distinctMembers?.length || 0;
  const filtersSummary = buildDateRangeSummary(query.fromDate, query.toDate);
  const timestamp = new Date().toISOString().slice(0, 10);

  // Streaming cursor transforming documents to map remarks cleanly
  async function* collectionCursorGenerator() {
    const stream = Collection.find(filter)
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean()
      .cursor();

    for await (const doc of stream) {
      yield {
        ...doc,
        remarks: doc.note || `Received-${doc.month || "Month"}`,
      };
    }
  }

  if (format === "excel") {
    const columns: IExcelColumnConfig[] = [
      { header: "ID", key: "memberCode", width: 12, alignment: "center" },
      { header: "MEMBER NAME", key: "memberName", width: 25 },
      { header: "COLLECTION DATE", key: "paymentDate", width: 16, alignment: "center", isDate: true },
      { header: "AMOUNT COLLECTED", key: "amount", width: 18, alignment: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 35 },
    ];

    await streamReportToExcel(res, {
      filename: `collection-report-${timestamp}.xlsx`,
      sheetName: "Collection Report",
      reportTitle: "COLLECTION REPORT",
      metadata: {
        "Filter Period": filtersSummary,
        "Total Collected": `BDT ${totalCollected.toLocaleString()}`,
        "No. of Payments": noOfPayments,
        "Members Paid": membersPaid,
      },
      columns,
      dataCursor: collectionCursorGenerator(),
      sumColumnKeys: ["amount"],
    });
  } else {
    const columns: IPdfColumnConfig[] = [
      { header: "ID", key: "memberCode", width: 50, align: "center" },
      { header: "MEMBER NAME", key: "memberName", width: 140 },
      { header: "COLLECTION DATE", key: "paymentDate", width: 85, align: "center", isDate: true },
      { header: "AMOUNT COLLECTED", key: "amount", width: 90, align: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 158 },
    ];

    await streamReportToPdf(res, {
      filename: `collection-report-${timestamp}.pdf`,
      reportTitle: "Collection Report",
      filtersSummary,
      kpis: [
        { label: "Total Collected", value: `BDT ${totalCollected.toLocaleString()}` },
        { label: "No. of Payments", value: noOfPayments },
        { label: "Members Paid", value: membersPaid },
      ],
      columns,
      dataCursor: collectionCursorGenerator(),
      sumColumnKeys: ["amount"],
      grandTotalLabel: "Total Collection",
    });
  }
}

/**
 * 4. Export Adjustments Report (PDF / Excel)
 * Matching Screenshot 4: ID | MEMBER | TYPE | DATE | AMOUNT | REMARKS
 */
async function exportAdjustmentReport(
  res: Response,
  query: IAdjustmentReportExportQuery
): Promise<void> {
  const format = (query.format || "pdf").toLowerCase();
  const dateFilter = buildDateFilter("adjustmentDate", query.fromDate, query.toDate);
  const filter: Record<string, any> = { ...dateFilter };

  if (query.type && query.type !== "All" && query.type !== "ALL" && query.type !== "All Types") {
    filter.$or = [
      { adjustmentType: query.type },
      { adjustmentTypeName: query.type },
    ];
  }

  const [summary] = await Adjustment.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        netAmount: { $sum: "$signedAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRecords = summary?.count || 0;
  const netAdjustment = summary?.netAmount || 0;
  const filtersSummary = `${buildDateRangeSummary(query.fromDate, query.toDate)}${
    query.type ? ` | Type: ${query.type}` : ""
  }`;
  const timestamp = new Date().toISOString().slice(0, 10);

  async function* adjustmentCursorGenerator() {
    const stream = Adjustment.find(filter)
      .sort({ adjustmentDate: -1, createdAt: -1 })
      .lean()
      .cursor();

    for await (const doc of stream) {
      yield {
        ...doc,
        type: doc.adjustmentTypeName || doc.adjustmentType,
        amount: doc.signedAmount !== undefined ? doc.signedAmount : doc.adjustmentAmount,
      };
    }
  }

  if (format === "excel") {
    const columns: IExcelColumnConfig[] = [
      { header: "ID", key: "adjustmentId", width: 12, alignment: "center" },
      { header: "MEMBER", key: "memberName", width: 25 },
      { header: "TYPE", key: "type", width: 20, alignment: "center" },
      { header: "DATE", key: "adjustmentDate", width: 15, alignment: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 18, alignment: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 35 },
    ];

    await streamReportToExcel(res, {
      filename: `adjustments-report-${timestamp}.xlsx`,
      sheetName: "Adjustment Report",
      reportTitle: "ADJUSTMENT REPORT",
      metadata: {
        "Filter Period": filtersSummary,
        "Total Records": totalRecords,
        "Net Adjustment": `BDT ${netAdjustment.toLocaleString()}`,
      },
      columns,
      dataCursor: adjustmentCursorGenerator(),
      sumColumnKeys: ["amount"],
    });
  } else {
    const columns: IPdfColumnConfig[] = [
      { header: "ID", key: "adjustmentId", width: 45, align: "center" },
      { header: "MEMBER", key: "memberName", width: 125 },
      { header: "TYPE", key: "type", width: 95 },
      { header: "DATE", key: "adjustmentDate", width: 65, align: "center", isDate: true },
      { header: "AMOUNT", key: "amount", width: 75, align: "right", isCurrency: true },
      { header: "REMARKS", key: "remarks", width: 118 },
    ];

    await streamReportToPdf(res, {
      filename: `adjustments-report-${timestamp}.pdf`,
      reportTitle: "Adjustment Report",
      filtersSummary,
      kpis: [
        { label: "Total Records", value: totalRecords },
        { label: "Net Adjustment", value: `BDT ${netAdjustment.toLocaleString()}` },
      ],
      columns,
      dataCursor: adjustmentCursorGenerator(),
      sumColumnKeys: ["amount"],
      grandTotalLabel: "Net Adjustment",
    });
  }
}

export const ReportServices = {
  exportExpenseReport,
  exportInvestmentReport,
  exportCollectionReport,
  exportAdjustmentReport,
};
