/**
 * Client-Specific Filter-Synced PDF & Excel Report Export Engine
 * Friends Goal Organization (Next.js 14+ App Router)
 *
 * Implements strict filter synchronization, template alignment matching
 * client sample documents (Image 1 - Image 5), auto-scaling tables,
 * currency formatting, formula/total summary rows, and legal metadata.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";

export interface IReportColumn {
  header: string;
  dataKey: string;
  excelWidth?: number;
  align?: "left" | "center" | "right";
  isCurrency?: boolean;
}

export interface IExportReportOptions {
  reportTitle: string; // e.g. "Collection Reports", "Due List Reports", "Expense Reports"
  filterSummary?: string; // e.g. "Report Period: October 2026 | Status: Due | Total Records: 12"
  columns: IReportColumn[];
  rows: Record<string, any>[]; // Strictly the filtered dataset visible on screen
  amountColumnKey?: string; // key of amount column to calculate grand total
  filenamePrefix: string;
  sheetName?: string;
  orientation?: "portrait" | "landscape";
  memberInfo?: {
    memberCode: string;
    fullName: string;
    phone?: string;
    totalDeposit?: number;
    dueAmount?: number;
    savingsBalance?: number;
  };
}

// ─── Formatting Helpers ────────────────────────────────────────────────────────

export function formatCurrencyValue(val: any): string {
  if (val == null || val === "") return "0.00";
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateVerificationCode(prefix = "FG"): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `${prefix}-VERIFY-${year}-${hex}`;
}

// ─── 1. Client-Specific PDF Export (Matching Sample Images 1, 2, 5) ────────────

export function exportReportToPdf(options: IExportReportOptions): void {
  const {
    reportTitle,
    filterSummary = `Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} | Total Records: ${options.rows.length}`,
    columns,
    rows,
    amountColumnKey,
    filenamePrefix,
    orientation = "portrait",
    memberInfo,
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - 2 * margin;

  // ── Header Title Block matching client template ─────────────────────────────
  // FRIND'S GOAL (Bold, Centered)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text("FRIND'S GOAL", pageWidth / 2, 38, { align: "center" });

  // Address
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  doc.text("154/1B(5th Floor), Moinarbagh, Uttar Badda, Dhaka-1212", pageWidth / 2, 51, { align: "center" });

  // Mobile & Website
  doc.setFontSize(8);
  doc.text("Mobile : 01774-987030, 01710-203911 Website: www.friendsgoal.org", pageWidth / 2, 63, { align: "center" });

  // Horizontal Rule under Header
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.0);
  doc.line(margin, 70, pageWidth - margin, 70);

  // Report Title (Bold, Underlined, Centered)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(0, 0, 0);
  const titleY = 87;
  doc.text(reportTitle, pageWidth / 2, titleY, { align: "center" });

  // Draw Underline for Report Title
  const titleWidth = doc.getTextWidth(reportTitle);
  doc.setLineWidth(0.75);
  doc.line(pageWidth / 2 - titleWidth / 2, titleY + 2, pageWidth / 2 + titleWidth / 2, titleY + 2);

  // Optional Member Info Strip (for Member Ledger / Statement)
  let currentY = 100;
  if (memberInfo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(14, 59, 108);
    const infoText = `Member: ${memberInfo.memberCode} – ${memberInfo.fullName} ${memberInfo.phone ? `| Mobile: ${memberInfo.phone}` : ""}`;
    doc.text(infoText, margin, currentY);

    if (memberInfo.dueAmount != null || memberInfo.totalDeposit != null) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      const metricsText = `Deposit: ৳ ${formatCurrencyValue(memberInfo.totalDeposit)} | Current Due: ৳ ${formatCurrencyValue(memberInfo.dueAmount)}`;
      doc.text(metricsText, pageWidth - margin, currentY, { align: "right" });
    }
    currentY += 13;
  }

  // Active Filter Metadata Block
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  doc.text(filterSummary, margin, currentY);
  currentY += 10;

  // ── Prepare Table Data & Accurate Grand Total ──────────────────────────────
  const tableHeaders = columns.map((c) => c.header);
  let tableRows: any[][] = [];

  // Calculate Grand Total directly from row dataset (handles numbers and formatted strings)
  let grandTotal = 0;
  if (amountColumnKey && rows.length > 0) {
    grandTotal = rows.reduce((acc, row) => {
      const rawVal = row[amountColumnKey];
      if (rawVal == null || rawVal === "") return acc;
      const cleanNum = typeof rawVal === "number"
        ? rawVal
        : parseFloat(String(rawVal).replace(/,/g, "").replace(/[^0-9.-]/g, ""));
      return acc + (isNaN(cleanNum) ? 0 : cleanNum);
    }, 0);
  }

  if (rows.length === 0) {
    tableRows = [
      columns.map((_, idx) => (idx === 0 ? "No records found for the selected period." : ""))
    ];
  } else {
    tableRows = rows.map((row, index) => {
      return columns.map((col) => {
        if (col.dataKey === "sl" || col.dataKey === "slNo") {
          return String(index + 1);
        }
        const val = row[col.dataKey];
        if (col.isCurrency) {
          return formatCurrencyValue(val);
        }
        return val != null ? String(val) : "";
      });
    });
  }

  // Column Styles Map
  const columnStyles: Record<number, any> = {};
  columns.forEach((col, idx) => {
    columnStyles[idx] = {
      halign: col.align || (col.isCurrency ? "right" : idx === 0 ? "center" : "left"),
      cellPadding: 4,
      fontSize: 8.5,
    };
  });

  // Calculate Foot Row: place "Total=" in the column immediately preceding the amount column
  const tableFoot: any[][] = [];
  if (amountColumnKey && rows.length > 0) {
    const amountColIdx = columns.findIndex((c) => c.dataKey === amountColumnKey);
    const labelColIdx = amountColIdx > 0 ? amountColIdx - 1 : 0;

    const footRow = columns.map((col, idx) => {
      if (idx === labelColIdx) {
        return {
          content: "Total=",
          styles: {
            halign: "right",
            fontStyle: "bold",
            textColor: [0, 0, 0],
          },
        };
      }
      if (idx === amountColIdx) {
        return {
          content: formatCurrencyValue(grandTotal),
          styles: {
            halign: "right",
            fontStyle: "bold",
            textColor: [0, 0, 0],
          },
        };
      }
      return {
        content: "",
        styles: {
          halign: "center",
        },
      };
    });
    tableFoot.push(footRow);
  }

  const verifyCode = generateVerificationCode();

  // ── Render autoTable matching Client PDF Layout ──────────────────────────────
  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableRows,
    foot: tableFoot.length > 0 ? tableFoot : undefined,
    theme: "grid",
    margin: { left: margin, right: margin, bottom: 40 },
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      valign: "middle",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [0, 0, 0],
      lineWidth: 0.75,
      halign: "center",
      cellPadding: 5,
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [0, 0, 0],
      lineWidth: 0.75,
      halign: "right",
      cellPadding: 5,
    },
    columnStyles,
    didDrawPage: (data) => {
      // ── Footer: Page X of Y & Verification Code ─────────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);

      // Left: Verification code & System Tag
      doc.text(`Official Document: ${verifyCode}`, margin, pageHeight - 20);

      // Center: Organization Notice
      doc.text("Friends Goal Society — Confidential Financial Record", pageWidth / 2, pageHeight - 20, { align: "center" });

      // Right: Page numbers
      doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: "right" });
    },
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const cleanFilename = `${filenamePrefix}_${timestamp}.pdf`;
  doc.save(cleanFilename);
}

// ─── 2. Client-Specific Excel Export (Matching Sample Images 3 & 4) ───────────

export async function exportReportToExcel(options: IExportReportOptions): Promise<void> {
  const {
    reportTitle,
    filterSummary = `Report Period: All | Total Records: ${options.rows.length}`,
    columns,
    rows,
    amountColumnKey,
    filenamePrefix,
    sheetName = "ReportSheet",
    memberInfo,
  } = options;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Friends Goal";
  workbook.lastModifiedBy = "System Administrator";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName.substring(0, 31), {
    views: [{ showGridLines: true }],
  });

  const totalCols = columns.length;
  const lastColLetter = getExcelColumnLetter(totalCols);

  // ── Row 2: FRIND'S GOAL ─────────────────────────────────────────────────────
  worksheet.mergeCells(`A2:${lastColLetter}2`);
  const orgCell = worksheet.getCell("A2");
  orgCell.value = "FRIND'S GOAL";
  orgCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF000000" } };
  orgCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 22;

  // ── Row 3: Address ──────────────────────────────────────────────────────────
  worksheet.mergeCells(`A3:${lastColLetter}3`);
  const addrCell = worksheet.getCell("A3");
  addrCell.value = "154/1B(5th Floor), Moinarbagh, Uttar Badda, Dhaka-1212";
  addrCell.font = { name: "Arial", size: 9, color: { argb: "FF333333" } };
  addrCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(3).height = 15;

  // ── Row 4: Contacts & Website ───────────────────────────────────────────────
  worksheet.mergeCells(`A4:${lastColLetter}4`);
  const contCell = worksheet.getCell("A4");
  contCell.value = "Mobile : 01774-987030, 01710-203911 Website: www.friendsgoal.org";
  contCell.font = { name: "Arial", size: 8.5, color: { argb: "FF333333" } };
  contCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(4).height = 15;

  // ── Row 5: Horizontal Line Border ───────────────────────────────────────────
  for (let c = 1; c <= totalCols; c++) {
    const cell = worksheet.getCell(5, c);
    cell.border = { bottom: { style: "medium", color: { argb: "FF000000" } } };
  }
  worksheet.getRow(5).height = 6;

  // ── Row 7: Report Title (Bold, Underlined) ──────────────────────────────────
  worksheet.mergeCells(`A7:${lastColLetter}7`);
  const titleCell = worksheet.getCell("A7");
  titleCell.value = reportTitle;
  titleCell.font = { name: "Arial", size: 12, bold: true, underline: true, color: { argb: "FF000000" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(7).height = 20;

  // ── Row 8: Filter Metadata ──────────────────────────────────────────────────
  worksheet.mergeCells(`A8:${lastColLetter}8`);
  const metaCell = worksheet.getCell("A8");
  const memberLine = memberInfo ? ` | Member: ${memberInfo.memberCode} - ${memberInfo.fullName}` : "";
  metaCell.value = `${filterSummary}${memberLine} | Exported: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  metaCell.font = { name: "Arial", size: 8.5, italic: true, color: { argb: "FF666666" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(8).height = 16;

  // ── Row 10: Table Header Row matching Client Template ───────────────────────
  const headerRowIndex = 10;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.height = 22;

  columns.forEach((col, idx) => {
    const colNum = idx + 1;
    const cell = worksheet.getCell(headerRowIndex, colNum);
    cell.value = col.header;
    // Dark Navy theme matching client instructions
    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0E3B6C" }, // Dark Navy #0E3B6C
    };
    cell.alignment = {
      horizontal: col.align || "center",
      vertical: "middle",
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  // ── Data Rows ───────────────────────────────────────────────────────────────
  let currentRowIndex = headerRowIndex + 1;
  let amountColIndex = -1;
  let totalSum = 0;

  if (rows.length === 0) {
    const emptyRow = worksheet.getRow(currentRowIndex);
    worksheet.mergeCells(`A${currentRowIndex}:${lastColLetter}${currentRowIndex}`);
    const emptyCell = worksheet.getCell(`A${currentRowIndex}`);
    emptyCell.value = "No records found for the selected period.";
    emptyCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF888888" } };
    emptyCell.alignment = { horizontal: "center", vertical: "middle" };
    emptyRow.height = 24;
    currentRowIndex++;
  } else {
    rows.forEach((row, rowIdx) => {
      const dataRow = worksheet.getRow(currentRowIndex);
      dataRow.height = 19;

      columns.forEach((col, colIdx) => {
        const colNum = colIdx + 1;
        const cell = worksheet.getCell(currentRowIndex, colNum);

        if (col.dataKey === "sl" || col.dataKey === "slNo") {
          cell.value = rowIdx + 1;
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else if (col.isCurrency) {
          const raw = row[col.dataKey];
          const num = typeof raw === "number" ? raw : parseFloat(String(raw || 0).replace(/,/g, "").replace(/[^0-9.-]/g, ""));
          cell.value = isNaN(num) ? 0 : num;
          cell.numFmt = "৳ #,##0.00;[Red](৳ #,##0.00);0.00";
          cell.alignment = { horizontal: "right", vertical: "middle" };

          if (amountColumnKey && col.dataKey === amountColumnKey) {
            amountColIndex = colNum;
            if (!isNaN(num)) totalSum += num;
          }
        } else {
          cell.value = row[col.dataKey] != null ? String(row[col.dataKey]) : "";
          cell.alignment = {
            horizontal: col.align || (colIdx === 0 ? "center" : "left"),
            vertical: "middle",
          };
        }

        cell.font = { name: "Arial", size: 9 };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      currentRowIndex++;
    });

    // ── Total Summary Row ────────────────────────────────────────────────────
    if (amountColIndex > 0) {
      const totalRow = worksheet.getRow(currentRowIndex);
      totalRow.height = 22;

      // Set label in column prior to amount
      const labelColNum = amountColIndex - 1;
      const labelCell = worksheet.getCell(currentRowIndex, labelColNum);
      labelCell.value = "Total=";
      labelCell.font = { name: "Arial", size: 10, bold: true };
      labelCell.alignment = { horizontal: "right", vertical: "middle" };

      // Set total value in amount column
      const totalCell = worksheet.getCell(currentRowIndex, amountColIndex);
      totalCell.value = totalSum;
      totalCell.numFmt = "৳ #,##0.00;[Red](৳ #,##0.00);0.00";
      totalCell.font = { name: "Arial", size: 10, bold: true };
      totalCell.alignment = { horizontal: "right", vertical: "middle" };

      // Double bottom border
      for (let c = 1; c <= totalCols; c++) {
        const cCell = worksheet.getCell(currentRowIndex, c);
        cCell.border = {
          top: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "double", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      }
    }
  }

  // ── Auto-Fit Column Widths ─────────────────────────────────────────────────
  columns.forEach((col, idx) => {
    const colNum = idx + 1;
    let maxLen = col.header.length;
    rows.forEach((r) => {
      const val = r[col.dataKey];
      if (val != null) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    });
    const targetWidth = col.excelWidth || Math.max(maxLen + 4, 11);
    worksheet.getColumn(colNum).width = Math.min(Math.max(targetWidth, 10), 40);
  });

  // ── Trigger Browser Download ───────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  a.download = `${filenamePrefix}_${timestamp}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// ── Helper: Excel column index to letter (1=A, 2=B, etc.) ────────────────────
function getExcelColumnLetter(colIndex: number): string {
  let temp;
  let letter = "";
  let col = colIndex;
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = Math.floor((col - temp) / 26);
  }
  return letter || "A";
}
