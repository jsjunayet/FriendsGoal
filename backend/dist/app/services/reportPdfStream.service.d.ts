import type { Response } from "express";
export interface IPdfColumnConfig {
    header: string;
    key: string;
    width: number;
    align?: "left" | "center" | "right";
    isCurrency?: boolean;
    isDate?: boolean;
}
export interface IStreamPdfOptions {
    filename: string;
    reportTitle: string;
    organizationName?: string;
    website?: string;
    printedBy?: string;
    filtersSummary?: string;
    kpis?: Array<{
        label: string;
        value: string | number;
    }>;
    columns: IPdfColumnConfig[];
    dataCursor: AsyncIterable<any>;
    sumColumnKeys?: string[];
    grandTotalLabel?: string;
}
/**
 * Draw the Friends Goal vector brand logo (emerald badge with growth equalizer bars).
 */
export declare function drawBrandLogo(doc: PDFKit.PDFDocument, x: number, y: number, size?: number): void;
/**
 * High-performance, zero memory leak streaming PDF generation service using PDFKit.
 * Pipes directly to the Express Response stream, supporting massive 1,000+ page datasets
 * with auto-repeating table headers, KPI summary cards, and dynamic "Page X of Y" footers.
 */
export declare function streamReportToPdf(res: Response, options: IStreamPdfOptions): Promise<void>;
//# sourceMappingURL=reportPdfStream.service.d.ts.map