import "../utils/pdfFontLoader";
import type { Response } from "express";
import type { IMember } from "../modules/Member/member.interface";
export interface IMemberExportData {
    member: IMember;
    totalDeposit: number;
    profitBalance: number;
    pendingWithdrawals: number;
    dueAmount: number;
    transactions: Array<{
        date: Date | string;
        type: string;
        reference: string;
        amount: number;
        status: string;
        remarks: string;
    }>;
}
export interface IStreamMemberPdfOptions {
    filename: string;
    organizationName?: string;
    website?: string;
    printedBy?: string;
    data: IMemberExportData;
}
/**
 * Stream a Single Member Master Profile Card & Financial Statement to PDF.
 * Uses PDFKit with A4 portrait, 36pt margins, two-column profile card, 4 KPI tiles,
 * and an itemized ledger table with automatic page break handling.
 */
export declare function streamMemberProfileToPdf(res: Response, options: IStreamMemberPdfOptions): Promise<void>;
//# sourceMappingURL=memberPdfStream.service.d.ts.map