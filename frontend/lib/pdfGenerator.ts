import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export interface IPdfGeneratorColumn {
  header: string;
  dataKey: string;
  widthPercent?: number; // Target column width percentage (e.g., 8, 20, 15, 17, 30)
  align?: "left" | "center" | "right";
  isCurrency?: boolean;
  isDate?: boolean;
  minWidth?: number; // Minimum width in points to protect headers
}

export interface IPdfGeneratorOptions {
  filename: string;
  reportTitle: string;
  organizationName?: string;
  subtitle?: string;
  website?: string;
  printedBy?: string;
  filtersSummary?: string;
  kpis?: Array<{ label: string; value: string | number }>;
  columns: IPdfGeneratorColumn[];
  rows: Record<string, any>[];
  sumColumnKeys?: string[];
  grandTotalLabel?: string;
  orientation?: "portrait" | "landscape";
}

/**
 * Lead Frontend Engineer - Dynamic Auto-Scaling PDF Generator System
 * Using jsPDF & jsPDF-AutoTable with dynamic cell height, auto-wrapping,
 * proportional column widths, header cell protection, and colSpan footers.
 */
export function generateDynamicPdf(options: IPdfGeneratorOptions): jsPDF {
  const {
    filename,
    reportTitle,
    organizationName = "Friends Goal",
    subtitle = "Financial Cooperative Society (Somiti)",
    website = "www.friendsgoal.com",
    printedBy = "System Administrator",
    filtersSummary = "All Records",
    kpis = [],
    columns,
    rows,
    sumColumnKeys = [],
    grandTotalLabel = "DIRECTORY TOTALS",
    orientation = "portrait",
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt for portrait
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt for portrait
  const margin = 36;
  const contentWidth = pageWidth - 2 * margin;

  // 1. Draw Branded Page Header
  let startY = margin;

  // Header Banner Brand Badge (Deep Navy #0E3B6C)
  doc.setFillColor(14, 59, 108); // Theme Navy #0E3B6C
  doc.roundedRect(margin, startY, 32, 32, 4, 4, "F");
  
  // Draw Logo Pillars inside Navy Box with Crimson Accent
  doc.setFillColor(255, 255, 255);
  const pillarW = 2.5;
  const gap = 2.5;
  const startX = margin + (32 - (4 * pillarW + 3 * gap)) / 2;
  const baseY = startY + 32 - 6;
  const heights = [8, 17, 13, 7];
  heights.forEach((h, i) => {
    if (i === 1) {
      doc.setFillColor(192, 38, 45); // Crimson Red accent pillar
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.roundedRect(startX + i * (pillarW + gap), baseY - h, pillarW, h, 1, 1, "F");
  });

  // Header Titles (Left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(14, 59, 108); // #0E3B6C
  doc.text(organizationName, margin + 40, startY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, margin + 40, startY + 26);

  // Header Titles (Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(reportTitle.toUpperCase(), pageWidth - margin, startY + 14, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(192, 38, 45); // Crimson Red #C0262D
  doc.text(website, pageWidth - margin, startY + 26, { align: "right" });

  // Divider Line in Navy Blue
  startY += 38;
  doc.setDrawColor(14, 59, 108); // #0E3B6C
  doc.setLineWidth(1.5);
  doc.line(margin, startY, pageWidth - margin, startY);

  startY += 10;

  // 2. Metadata Filter Summary & KPI Badges Box
  const boxHeight = kpis.length > 0 ? 38 : 22;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, startY, contentWidth, boxHeight, 4, 4, "FD");

  // Metadata Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const filterText = `Filter: ${filtersSummary}    |    Generated: ${formatDateTime(new Date())}`;
  doc.text(filterText, margin + 8, startY + 14);

  // KPI Tiles inside metadata box
  if (kpis.length > 0) {
    let kpiX = margin + 8;
    const kpiY = startY + 28;
    kpis.forEach((kpi) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(14, 59, 108); // #0E3B6C
      doc.text(`${kpi.label}: `, kpiX, kpiY);
      const labelWidth = doc.getTextWidth(`${kpi.label}: `);
      doc.setTextColor(15, 23, 42);
      doc.text(`${kpi.value}    `, kpiX + labelWidth, kpiY);
      kpiX += 135;
    });
  }

  startY += boxHeight + 12;

  // 3. Configure Column Width Ratios & Header Layouts
  // ID (~8%), MEMBER/NAME (~20%), DATE/PHONE (~15%), AMOUNT/DEPOSIT (~17%), REMARKS (~25-30%)
  const columnStylesConfig: Record<number, any> = {};

  columns.forEach((col, idx) => {
    const colAlign = col.align || (col.isCurrency ? "right" : "left");
    const styleObj: any = {
      halign: colAlign,
      valign: "middle",
      overflow: "linebreak",
    };

    // Calculate percentage width or pixel minWidth
    if (col.widthPercent) {
      styleObj.cellWidth = (contentWidth * col.widthPercent) / 100;
    } else {
      // Auto-assign width by type if widthPercent not explicit
      const keyUpper = col.dataKey.toUpperCase();
      const headerUpper = col.header.toUpperCase();

      if (keyUpper.includes("ID") || keyUpper.includes("CODE") || idx === 0) {
        styleObj.cellWidth = Math.max(contentWidth * 0.08, col.minWidth || 35);
        styleObj.halign = "center";
      } else if (keyUpper.includes("NAME") || keyUpper.includes("MEMBER") || keyUpper.includes("INVESTMENT")) {
        styleObj.cellWidth = Math.max(contentWidth * 0.20, col.minWidth || 95);
      } else if (keyUpper.includes("DATE") || keyUpper.includes("PHONE") || keyUpper.includes("MOBILE") || keyUpper.includes("CATEGORY")) {
        styleObj.cellWidth = Math.max(contentWidth * 0.15, col.minWidth || 70);
      } else if (col.isCurrency || keyUpper.includes("AMOUNT") || keyUpper.includes("DEPOSIT") || keyUpper.includes("EXPENSE")) {
        styleObj.cellWidth = Math.max(contentWidth * 0.17, col.minWidth || 80);
        styleObj.fontStyle = "bold";
        styleObj.halign = "right";
      } else if (keyUpper.includes("REMARKS") || keyUpper.includes("NOTE") || keyUpper.includes("DESCRIPTION")) {
        styleObj.cellWidth = "auto"; // Maximum available width to REMARKS
      }
    }

    if (col.minWidth) {
      styleObj.minCellWidth = col.minWidth;
    }

    columnStylesConfig[idx] = styleObj;
  });

  // 4. Prepare Table Body Rows & Totals Calculation
  const totalsTracker: Record<string, number> = {};
  sumColumnKeys.forEach((k) => (totalsTracker[k] = 0));

  const tableBody: RowInput[] = rows.map((row) => {
    return columns.map((col) => {
      const rawVal = row[col.dataKey];
      if (col.isCurrency) {
        const num = Number(rawVal) || 0;
        if (sumColumnKeys.includes(col.dataKey)) {
          totalsTracker[col.dataKey] = (totalsTracker[col.dataKey] || 0) + num;
        }
        return formatCurrency(num);
      }
      if (col.isDate && rawVal) {
        return formatDateToDisplay(rawVal);
      }
      return rawVal !== undefined && rawVal !== null ? String(rawVal) : "-";
    });
  });

  // 5. Build Dynamic Footer Summary Row with colSpan merged cells
  let tableFoot: RowInput[] | undefined = undefined;

  if (sumColumnKeys.length > 0 && rows.length > 0) {
    // Find the first sum column index to determine colSpan for label
    const firstSumColIndex = columns.findIndex((c) => sumColumnKeys.includes(c.dataKey));
    const labelColSpan = firstSumColIndex > 0 ? firstSumColIndex : 1;

    const footRow: any[] = [];

    // Merged Label Cell (colSpan across non-amount columns so label never wraps to 2 lines)
    footRow.push({
      content: grandTotalLabel.toUpperCase(),
      colSpan: labelColSpan,
      styles: {
        halign: "left",
        fontStyle: "bold",
        textColor: [14, 59, 108], // #0E3B6C
        fillColor: [241, 245, 249], // #F1F5F9
        cellPadding: 6,
      },
    });

    // Fill remaining footer cells
    for (let cIdx = labelColSpan; cIdx < columns.length; cIdx++) {
      const col = columns[cIdx];
      if (sumColumnKeys.includes(col.dataKey)) {
        const sumVal = totalsTracker[col.dataKey] || 0;
        footRow.push({
          content: formatCurrency(sumVal),
          styles: {
            halign: col.align || "right",
            fontStyle: "bold",
            textColor: [192, 38, 45], // Crimson Red #C0262D
            fillColor: [241, 245, 249],
            cellPadding: 6,
          },
        });
      } else {
        footRow.push({
          content: "",
          styles: {
            fillColor: [241, 245, 249],
            cellPadding: 6,
          },
        });
      }
    }

    tableFoot = [footRow];
  }

  // 6. Execute jsPDF-AutoTable with Dynamic Styles & Cell Parsing
  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header.toUpperCase())],
    body: tableBody,
    foot: tableFoot,
    margin: { top: margin + 30, right: margin, bottom: margin + 25, left: margin },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak", // Auto-wraps long text like Remarks, Member Name
      valign: "middle",
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [14, 59, 108], // Deep Navy #0E3B6C
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "center",
      minCellHeight: 20,
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [14, 59, 108],
      fontSize: 8.5,
      fontStyle: "bold",
      cellPadding: 6,
    },
    columnStyles: columnStylesConfig,
    didParseCell: function (data) {
      // Dynamic row height adjustment for multi-line text wrapping
      if (data.section === "body") {
        data.row.height = Math.max(data.row.height, 20);
      }
    },
    didDrawPage: function (data) {
      // Re-draw header banner on subsequent pages if autoTable creates new pages
      if (data.pageNumber > 1) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(14, 59, 108); // #0E3B6C
        doc.text(organizationName, margin, margin - 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(reportTitle.toUpperCase(), pageWidth - margin, margin - 10, { align: "right" });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, margin - 4, pageWidth - margin, margin - 4);
      }
    },
  });

  // 7. Add Dynamic Page Footers ("Page X of Y") & Brand Bottom Accent Bar
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - margin + 8;

    // Thin top border line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);

    // Footer Left: System metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Printed By: ${printedBy}  |  ${organizationName}  |  ${website}`,
      margin,
      footerY
    );

    // Footer Right: Dynamic "Page X of Y"
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 59, 108);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: "right" });

    // Standardized disclaimer note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("This is an auto-generated document, no signature required.", margin, footerY + 10);

    // Dual-Tone Bottom Accent Bar (Crimson Red #C0262D + Deep Navy #0E3B6C)
    const barY = pageHeight - 6;
    const halfWidth = pageWidth / 2;
    doc.setFillColor(192, 38, 45); // Left Crimson Red #C0262D
    doc.rect(0, barY, halfWidth, 6, "F");
    doc.setFillColor(14, 59, 108); // Right Deep Navy #0E3B6C
    doc.rect(halfWidth, barY, halfWidth, 6, "F");
  }

  return doc;
}

/**
 * Download generated dynamic PDF file in the browser
 */
export function downloadDynamicPdf(options: IPdfGeneratorOptions): void {
  const doc = generateDynamicPdf(options);
  doc.save(options.filename);
}

// Helper formatting functions
function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-BDT ${formatted}` : `BDT ${formatted}`;
}

function formatDateToDisplay(val: any): string {
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  } catch {
    return String(val);
  }
}

function formatDateTime(d: Date): string {
  try {
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()} ${hours}:${mins}`;
  } catch {
    return d.toISOString();
  }
}
