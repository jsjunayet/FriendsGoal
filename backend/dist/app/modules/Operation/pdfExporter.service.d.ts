import "../../utils/pdfFontLoader";
import type { IDueListItem } from "./operation.interface";
/**
 * Lead Frontend Engineer - Dynamic PDF Generation System
 * Generates due list PDF with dynamic cell heights, auto-wrapping text,
 * protected header cells, balanced column ratios, and merged summary footer.
 */
export declare function generateDueListPdf(items: IDueListItem[], filtersSummary?: string): Promise<Buffer>;
//# sourceMappingURL=pdfExporter.service.d.ts.map