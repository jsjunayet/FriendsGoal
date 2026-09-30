import type { Response } from "express";
import ExcelJS from "exceljs";

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
export async function streamReportToExcel(
  res: Response,
  options: IStreamExcelOptions
): Promise<void> {
  const {
    filename,
    sheetName = "Report",
    reportTitle,
    organizationName = "Friends Goal",
    website = "www.friendsgoal.com",
    metadata = {},
    columns,
    dataCursor,
    sumColumnKeys = [],
  } = options;

  // 1. Set streaming HTTP response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // 2. Initialize WorkbookWriter streaming directly into res
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
    useSharedStrings: false, // Memory optimization
  });

  // Calculate header row offset based on title & metadata banner
  let headerRowIndex = 1;
  const hasTitleBanner = Boolean(reportTitle);
  if (hasTitleBanner) {
    headerRowIndex = 3 + Object.keys(metadata).length + 1; // Title + Brand + Metadata + Blank row
  }

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: headerRowIndex, xSplit: 0 }],
    properties: { defaultRowHeight: 20 },
  });

  // 3. Configure Columns
  worksheet.columns = columns.map((col) => ({
    key: col.key,
    width: col.width || 18,
  }));

  // 4. Optional Top Brand & Metadata Banner
  if (hasTitleBanner) {
    const titleRow = worksheet.addRow([`${organizationName} — ${reportTitle}`]);
    titleRow.height = 26;
    titleRow.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF046A38" } };
    titleRow.commit();

    const subRow = worksheet.addRow([`Official Portal: ${website} | Generated: ${new Date().toLocaleString()}`]);
    subRow.height = 18;
    subRow.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF666666" } };
    subRow.commit();

    for (const [metaKey, metaVal] of Object.entries(metadata)) {
      const metaRow = worksheet.addRow([`${metaKey}: ${metaVal}`]);
      metaRow.height = 17;
      metaRow.font = { name: "Calibri", size: 9.5, bold: false, color: { argb: "FF333333" } };
      metaRow.commit();
    }

    // Spacer
    const blankRow = worksheet.addRow([]);
    blankRow.height = 10;
    blankRow.commit();
  }

  // 5. Styled Header Row
  const headerValues = columns.map((c) => c.header);
  const headerRow = worksheet.addRow(headerValues);
  headerRow.height = 26;

  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF046A38" }, // Somiti Green #046A38
    };
    cell.font = {
      name: "Calibri",
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };
    const colConfig = columns[colNumber - 1];
    cell.alignment = {
      vertical: "middle",
      horizontal: colConfig?.alignment || (colConfig?.isCurrency ? "right" : "left"),
      wrapText: false,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF03532C" } },
      bottom: { style: "medium", color: { argb: "FF03532C" } },
      left: { style: "thin", color: { argb: "FF03532C" } },
      right: { style: "thin", color: { argb: "FF03532C" } },
    };
  });
  headerRow.commit();

  // 6. Stream Data Rows via MongoDB Cursor
  let dataRowCount = 0;
  const startDataRowNumber = headerRowIndex + 1;
  const totalsTracker: Record<string, number> = {};
  for (const sumKey of sumColumnKeys) {
    totalsTracker[sumKey] = 0;
  }

  for await (const doc of dataCursor) {
    dataRowCount++;
    const rowValues = columns.map((col) => {
      const val = doc[col.key];
      if (val === undefined || val === null) return "";
      if (col.isDate && val) {
        return formatDateToDisplay(val);
      }
      if (col.isCurrency) {
        const num = Number(val) || 0;
        if (sumColumnKeys.includes(col.key)) {
          totalsTracker[col.key] = (totalsTracker[col.key] || 0) + num;
        }
        return num;
      }
      return val;
    });

    const dataRow = worksheet.addRow(rowValues);
    dataRow.height = 20;

    dataRow.eachCell((cell, colNumber) => {
      const colConfig = columns[colNumber - 1];
      const isEven = dataRowCount % 2 === 0;

      // Zebra striping
      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FBF9" },
        };
      }

      cell.font = { name: "Calibri", size: 10, color: { argb: "FF1E293B" } };

      cell.alignment = {
        vertical: "middle",
        horizontal: colConfig?.alignment || (colConfig?.isCurrency ? "right" : "left"),
      };

      // Currency formatting: BDT #,##0.00
      if (colConfig?.isCurrency) {
        cell.numFmt = '"BDT "#,##0.00;[Red]"-BDT "#,##0.00;"BDT "0.00';
      }

      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });

    dataRow.commit();
  }

  // 7. Auto-Apply Summary Row with =SUM() Formulas
  if (sumColumnKeys.length > 0 && dataRowCount > 0) {
    const endDataRowNumber = startDataRowNumber + dataRowCount - 1;
    const summaryValues: (string | { formula: string; result?: number } | number)[] = columns.map(
      (col, colIdx) => {
        if (colIdx === 0) return "Total";
        if (sumColumnKeys.includes(col.key)) {
          const colLetter = getExcelColumnLetter(colIdx + 1);
          return {
            formula: `SUM(${colLetter}${startDataRowNumber}:${colLetter}${endDataRowNumber})`,
            result: totalsTracker[col.key] || 0,
          };
        }
        return "";
      }
    );

    const summaryRow = worksheet.addRow(summaryValues);
    summaryRow.height = 24;

    summaryRow.eachCell((cell, colNumber) => {
      const colConfig = columns[colNumber - 1];
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8F5E9" }, // Soft light green summary background
      };
      cell.font = {
        name: "Calibri",
        bold: true,
        size: 10.5,
        color: { argb: "FF046A38" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: colConfig?.alignment || (colConfig?.isCurrency ? "right" : "left"),
      };
      if (colConfig?.isCurrency) {
        cell.numFmt = '"BDT "#,##0.00;[Red]"-BDT "#,##0.00;"BDT "0.00';
      }
      cell.border = {
        top: { style: "thin", color: { argb: "FF046A38" } },
        bottom: { style: "double", color: { argb: "FF046A38" } },
      };
    });

    summaryRow.commit();
  }

  // 8. Finalize and flush stream
  worksheet.commit();
  await workbook.commit();
}

/**
 * Convert 1-based column index to Excel column letters (A, B, ..., Z, AA, AB, etc.)
 */
function getExcelColumnLetter(colIndex: number): string {
  let temp: number;
  let letter = "";
  let current = colIndex;
  while (current > 0) {
    temp = (current - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    current = Math.floor((current - temp - 1) / 26);
  }
  return letter;
}

/**
 * Format Date to DD-MMM-YYYY (e.g. 22-Oct-2025)
 */
function formatDateToDisplay(val: any): string {
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(val);
  }
}
