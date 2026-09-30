import type { Response } from "express";
import PDFDocument from "pdfkit";

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
  kpis?: Array<{ label: string; value: string | number }>;
  columns: IPdfColumnConfig[];
  dataCursor: AsyncIterable<any>;
  sumColumnKeys?: string[];
  grandTotalLabel?: string;
}

/**
 * Draw the Friends Goal vector brand logo (emerald badge with growth equalizer bars).
 */
export function drawBrandLogo(doc: PDFKit.PDFDocument, x: number, y: number, size = 32) {
  doc.save();
  // Emerald rounded square #046A38
  doc.roundedRect(x, y, size, size, 6).fill("#046A38");

  // 4 equalizer bars representing growth and somiti cooperation
  const pillarWidth = 2.5;
  const gap = 2.5;
  const startX = x + (size - (4 * pillarWidth + 3 * gap)) / 2;
  const baseY = y + size - 7;
  const heights = [8, 17, 13, 7];

  heights.forEach((h, i) => {
    doc
      .roundedRect(startX + i * (pillarWidth + gap), baseY - h, pillarWidth, h, 1)
      .fill("#FFFFFF");
  });

  doc.restore();
}

/**
 * High-performance, zero memory leak streaming PDF generation service using PDFKit.
 * Pipes directly to the Express Response stream, supporting massive 1,000+ page datasets
 * with auto-repeating table headers, KPI summary cards, and dynamic "Page X of Y" footers.
 */
export async function streamReportToPdf(
  res: Response,
  options: IStreamPdfOptions
): Promise<void> {
  const {
    filename,
    reportTitle,
    organizationName = "Friends Goal",
    website = "www.friendsgoal.com",
    printedBy = "System Administrator",
    filtersSummary = "All Records",
    kpis = [],
    columns,
    dataCursor,
    sumColumnKeys = [],
    grandTotalLabel = "Total",
  } = options;

  // 1. Set streaming HTTP response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // 2. Initialize PDFKit Document (A4 portrait, 36pt margins)
  const doc = new PDFDocument({
    size: "A4",
    margin: 36,
    bufferPages: true, // Enables dynamic "Page X of Y" footers across all pages
    info: {
      Title: reportTitle,
      Author: organizationName,
      Subject: "Financial and Member Management Report",
      CreationDate: new Date(),
    },
  });

  // Direct pipe to Express Response stream
  doc.pipe(res);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - 2 * margin; // 523.28 pt
  const bottomBoundary = pageHeight - margin - 35; // Reserve 35pt for footer

  let currentPageNumber = 1;
  const totalsTracker: Record<string, number> = {};
  for (const sumKey of sumColumnKeys) {
    totalsTracker[sumKey] = 0;
  }
  let totalRowCount = 0;

  // 3. Helper: Draw Page Header Banner
  const drawPageHeader = (isFirstPage: boolean) => {
    const topY = margin;

    // Top-Left: Logo & Brand Name
    drawBrandLogo(doc, margin, topY, 32);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#046A38")
      .text(organizationName, margin + 40, topY + 2);

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor("#64748B")
      .text("Financial Cooperative Society (Somiti)", margin + 40, topY + 18);

    // Top-Right: Website & Report Title
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#0F172A")
      .text(reportTitle.toUpperCase(), margin, topY + 2, {
        width: contentWidth,
        align: "right",
      });

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#046A38")
      .text(website, margin, topY + 18, {
        width: contentWidth,
        align: "right",
      });

    // Divider Line
    doc
      .strokeColor("#046A38")
      .lineWidth(1.5)
      .moveTo(margin, topY + 38)
      .lineTo(margin + contentWidth, topY + 38)
      .stroke();

    let currentY = topY + 44;

    // Metadata Box & KPI Summary (Rendered on first page)
    if (isFirstPage) {
      const boxHeight = kpis.length > 0 ? 38 : 24;

      doc
        .roundedRect(margin, currentY, contentWidth, boxHeight, 4)
        .fillAndStroke("#F8FAFC", "#E2E8F0");

      doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor("#334155")
        .text(`Filter Period: `, margin + 8, currentY + 7, { continued: true })
        .font("Helvetica")
        .fillColor("#475569")
        .text(filtersSummary, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#334155")
        .text(`    |    Generated: `, { continued: true })
        .font("Helvetica")
        .fillColor("#475569")
        .text(formatDateTime(new Date()));

      // KPI Badges inside Metadata Box
      if (kpis.length > 0) {
        let kpiX = margin + 8;
        const kpiY = currentY + 20;

        for (const kpi of kpis) {
          doc
            .fontSize(7.5)
            .font("Helvetica-Bold")
            .fillColor("#046A38")
            .text(`${kpi.label}: `, kpiX, kpiY, { continued: true })
            .font("Helvetica-Bold")
            .fillColor("#0F172A")
            .text(`${kpi.value}    `);
          kpiX += 130;
        }
      }

      currentY += boxHeight + 8;
    }

    return currentY;
  };

  // 4. Helper: Draw Repeating Table Header
  const drawTableHeader = (startY: number): number => {
    const rowHeight = 20;

    // Header background #046A38
    doc
      .roundedRect(margin, startY, contentWidth, rowHeight, 2)
      .fill("#046A38");

    let currentX = margin;
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#FFFFFF");

    for (const col of columns) {
      const align = col.align || (col.isCurrency ? "right" : "left");
      const padX = 4;
      const textX = currentX + padX;
      const textW = col.width - 2 * padX;

      doc.text(col.header.toUpperCase(), textX, startY + 5.5, {
        width: textW,
        align,
      });

      currentX += col.width;
    }

    return startY + rowHeight;
  };

  // 5. Initial First Page Setup
  let currentY = drawPageHeader(true);
  currentY = drawTableHeader(currentY);

  // 6. Stream Data Rows via MongoDB Cursor
  const baseRowHeight = 18;

  for await (const docData of dataCursor) {
    totalRowCount++;

    // Check if row exceeds printable page boundary
    if (currentY + baseRowHeight > bottomBoundary) {
      doc.addPage();
      currentPageNumber++;
      currentY = drawPageHeader(false);
      currentY = drawTableHeader(currentY);
    }

    const isEven = totalRowCount % 2 === 0;
    if (isEven) {
      doc.rect(margin, currentY, contentWidth, baseRowHeight).fill("#F8FAFC");
    }

    // Border line bottom
    doc
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .moveTo(margin, currentY + baseRowHeight)
      .lineTo(margin + contentWidth, currentY + baseRowHeight)
      .stroke();

    let cellX = margin;
    doc.fontSize(7.8).font("Helvetica").fillColor("#1E293B");

    for (const col of columns) {
      const rawVal = docData[col.key];
      let displayVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : "-";

      if (col.isDate && rawVal) {
        displayVal = formatDateToDisplay(rawVal);
      } else if (col.isCurrency) {
        const num = Number(rawVal) || 0;
        if (sumColumnKeys.includes(col.key)) {
          totalsTracker[col.key] = (totalsTracker[col.key] || 0) + num;
        }
        displayVal = formatCurrency(num);
      }

      const align = col.align || (col.isCurrency ? "right" : "left");
      const padX = 4;
      const textX = cellX + padX;
      const textW = col.width - 2 * padX;

      // Color coding for monetary amounts or status
      if (col.isCurrency && Number(rawVal) > 0) {
        doc.font("Helvetica-Bold").fillColor("#046A38");
      } else if (col.isCurrency && Number(rawVal) < 0) {
        doc.font("Helvetica-Bold").fillColor("#DC2626");
      } else if (col.key === "status") {
        const s = String(rawVal).toLowerCase();
        if (s === "active" || s === "paid" || s === "running") {
          doc.font("Helvetica-Bold").fillColor("#046A38");
        } else if (s === "inactive" || s === "due" || s === "closed") {
          doc.font("Helvetica-Bold").fillColor("#DC2626");
        } else {
          doc.font("Helvetica").fillColor("#475569");
        }
      } else {
        doc.font("Helvetica").fillColor("#1E293B");
      }

      doc.text(displayVal, textX, currentY + 4.5, {
        width: textW,
        align,
        ellipsis: true,
      });

      cellX += col.width;
    }

    currentY += baseRowHeight;
  }

  // 7. Auto-Apply Summary Row at the bottom of the table
  if (sumColumnKeys.length > 0 && totalRowCount > 0) {
    const summaryRowHeight = 22;
    if (currentY + summaryRowHeight > bottomBoundary) {
      doc.addPage();
      currentY = drawPageHeader(false);
      currentY = drawTableHeader(currentY);
    }

    doc
      .rect(margin, currentY, contentWidth, summaryRowHeight)
      .fill("#E8F5E9");

    doc
      .strokeColor("#046A38")
      .lineWidth(1)
      .moveTo(margin, currentY)
      .lineTo(margin + contentWidth, currentY)
      .moveTo(margin, currentY + summaryRowHeight)
      .lineTo(margin + contentWidth, currentY + summaryRowHeight)
      .stroke();

    let sumX = margin;
    for (let cIdx = 0; cIdx < columns.length; cIdx++) {
      const col = columns[cIdx];
      if (!col) continue;
      const padX = 4;
      const textX = sumX + padX;
      const textW = col.width - 2 * padX;
      const align = col.align || (col.isCurrency ? "right" : "left");

      if (cIdx === 0) {
        doc
          .fontSize(8.5)
          .font("Helvetica-Bold")
          .fillColor("#046A38")
          .text(grandTotalLabel.toUpperCase(), textX, currentY + 6, {
            width: textW,
            align: "left",
          });
      } else if (sumColumnKeys.includes(col.key)) {
        const sumVal = totalsTracker[col.key] || 0;
        doc
          .fontSize(8.5)
          .font("Helvetica-Bold")
          .fillColor("#046A38")
          .text(formatCurrency(sumVal), textX, currentY + 6, {
            width: textW,
            align,
          });
      }

      sumX += col.width;
    }
  }

  // 8. Dynamic Page Numbering & Footer Stamping ("Page X of Y")
  const pages = doc.bufferedPageRange();
  const totalPages = pages.count;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);

    const footerY = pageHeight - margin - 15;

    // Thin top border
    doc
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .moveTo(margin, footerY - 5)
      .lineTo(margin + contentWidth, footerY - 5)
      .stroke();

    // Footer Left: Printed By & System Identification
    doc
      .fontSize(7.5)
      .font("Helvetica")
      .fillColor("#94A3B8")
      .text(
        `Generated: ${formatDateTime(new Date())}  |  Printed By: ${printedBy}  |  ${organizationName}`,
        margin,
        footerY,
        { width: contentWidth * 0.7, align: "left" }
      );

    // Footer Right: Dynamic "Page X of Y"
    doc
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .fillColor("#64748B")
      .text(`Page ${i + 1} of ${totalPages}`, margin, footerY, {
        width: contentWidth,
        align: "right",
      });
  }

  // 9. Finalize and close stream
  doc.end();
}

/**
 * Format currency with BDT symbol (BDT #,##0.00)
 */
function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-BDT ${formatted}` : `BDT ${formatted}`;
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

/**
 * Format Date & Time for headers and footers
 */
function formatDateTime(d: Date): string {
  try {
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
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${mins}`;
  } catch {
    return d.toISOString();
  }
}
