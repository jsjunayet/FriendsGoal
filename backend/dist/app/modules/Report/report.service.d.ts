import type { Response } from "express";
import type { IExpenseReportExportQuery, IInvestmentReportExportQuery, ICollectionReportExportQuery, IAdjustmentReportExportQuery } from "./report.interface";
/**
 * 1. Export Expense Report (PDF / Excel)
 * Matching Screenshot 1: ID | MEMBER | CATEGORY | DATE | AMOUNT | REMARKS
 */
declare function exportExpenseReport(res: Response, query: IExpenseReportExportQuery): Promise<void>;
/**
 * 2. Export Investment Income Report (PDF / Excel)
 * Matching Screenshot 2: ID | INVESTMENT NAME | DATE | AMOUNT | REMARKS
 */
declare function exportInvestmentReport(res: Response, query: IInvestmentReportExportQuery): Promise<void>;
/**
 * 3. Export Collection Report (PDF / Excel)
 * Matching Screenshot 3: ID | MEMBER NAME | COLLECTION DATE | AMOUNT COLLECTED | REMARKS
 */
declare function exportCollectionReport(res: Response, query: ICollectionReportExportQuery): Promise<void>;
/**
 * 4. Export Adjustments Report (PDF / Excel)
 * Matching Screenshot 4: ID | MEMBER | TYPE | DATE | AMOUNT | REMARKS
 */
declare function exportAdjustmentReport(res: Response, query: IAdjustmentReportExportQuery): Promise<void>;
export declare const ReportServices: {
    exportExpenseReport: typeof exportExpenseReport;
    exportInvestmentReport: typeof exportInvestmentReport;
    exportCollectionReport: typeof exportCollectionReport;
    exportAdjustmentReport: typeof exportAdjustmentReport;
};
export {};
//# sourceMappingURL=report.service.d.ts.map