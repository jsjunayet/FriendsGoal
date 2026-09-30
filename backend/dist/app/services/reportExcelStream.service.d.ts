import type { Response } from "express";
export interface IExcelColumnConfig {
    header: string;
    key: string;
    width?: number;
    alignment?: "left" | "center" | "right";
    isCurrency?: boolean;
    isDate?: boolean;
}
export interface IStreamExcelOptions {
    filename: string;
    sheetName?: string;
    reportTitle?: string;
    organizationName?: string;
    website?: string;
    metadata?: Record<string, string | number>;
    columns: IExcelColumnConfig[];
    dataCursor: AsyncIterable<any>;
    sumColumnKeys?: string[];
    totalRecordsEstimate?: number;
}
/**
 * High-performance, zero-memory-leak Excel streaming service using ExcelJS.stream.xlsx.WorkbookWriter.
 * Flushes row by row directly to the Express Response stream, supporting millions of records.
 */
export declare function streamReportToExcel(res: Response, options: IStreamExcelOptions): Promise<void>;
//# sourceMappingURL=reportExcelStream.service.d.ts.map