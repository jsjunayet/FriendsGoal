export type TExportFormat = "pdf" | "excel";
export interface IExpenseReportExportQuery {
    fromDate?: string;
    toDate?: string;
    format?: TExportFormat;
}
export interface IInvestmentReportExportQuery {
    fromDate?: string;
    toDate?: string;
    format?: TExportFormat;
}
export interface ICollectionReportExportQuery {
    fromDate?: string;
    toDate?: string;
    format?: TExportFormat;
}
export interface IAdjustmentReportExportQuery {
    fromDate?: string;
    toDate?: string;
    type?: string;
    format?: TExportFormat;
}
export interface IMemberExportAllQuery {
    status?: "ACTIVE" | "INACTIVE" | "ALL" | "active" | "inactive" | "all";
    format?: TExportFormat;
}
//# sourceMappingURL=report.interface.d.ts.map