"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawBrandLogo = drawBrandLogo;
exports.streamReportToPdf = streamReportToPdf;
const pdfkit_1 = __importDefault(require("pdfkit"));
/**
 * Draw the Friends Goal official vector brand logo badge (Navy ring with Crimson FG).
 */
function drawBrandLogo(doc, x, y, size = 32) {
    doc.save();
    const radius = size / 2;
    const centerX = x + radius;
    const centerY = y + radius;
    // Navy outer circle ring
    doc.lineWidth(2).circle(centerX, centerY, radius - 1).fillAndStroke("#FFFFFF", "#0E3B6C");
    // Bold "FG" text in Crimson Red
    doc
        .fontSize(size * 0.44)
        .font("Helvetica-Bold")
        .fillColor("#C0262D")
        .text("FG", x, centerY - size * 0.22, {
        width: size,
        align: "center",
    });
    doc.restore();
}
/**
 * High-performance, zero memory leak streaming PDF generation service using PDFKit.
 * Pipes directly to the Express Response stream, supporting massive 1,000+ page datasets
 * with auto-repeating table headers, KPI summary cards, and dynamic "Page X of Y" footers.
 */
async function streamReportToPdf(res, options) {
    const { filename, reportTitle, organizationName = "Friends Goal", website = "www.friendsgoal.com", printedBy = "System Administrator", filtersSummary = "All Records", kpis = [], columns, dataCursor, sumColumnKeys = [], grandTotalLabel = "Total", } = options;
    // 1. Set streaming HTTP response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    // 2. Initialize PDFKit Document (A4 portrait, 36pt margins)
    const doc = new pdfkit_1.default({
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
    const totalsTracker = {};
    for (const sumKey of sumColumnKeys) {
        totalsTracker[sumKey] = 0;
    }
    let totalRowCount = 0;
    // 3. Helper: Draw Page Header Banner
    const drawPageHeader = (isFirstPage) => {
        const topY = margin;
        // Top-Left: Logo & Brand Name
        drawBrandLogo(doc, margin, topY, 32);
        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .fillColor("#0E3B6C") // #0E3B6C
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
            .fillColor("#C0262D") // Crimson Red #C0262D
            .text(website, margin, topY + 18, {
            width: contentWidth,
            align: "right",
        });
        // Divider Line in Navy Blue
        doc
            .strokeColor("#0E3B6C")
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
                        .fillColor("#0E3B6C")
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
    const drawTableHeader = (startY) => {
        // Determine header row height dynamically
        doc.fontSize(8.5).font("Helvetica-Bold");
        let maxHeaderHeight = 20;
        for (const col of columns) {
            const padX = 4;
            const textW = col.width - 2 * padX;
            const h = doc.heightOfString(col.header.toUpperCase(), { width: textW }) + 8;
            if (h > maxHeaderHeight)
                maxHeaderHeight = h;
        }
        // Header background #0E3B6C Deep Navy
        doc
            .roundedRect(margin, startY, contentWidth, maxHeaderHeight, 2)
            .fill("#0E3B6C");
        let currentX = margin;
        doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#FFFFFF");
        for (const col of columns) {
            const align = col.align || (col.isCurrency ? "right" : "left");
            const padX = 4;
            const textX = currentX + padX;
            const textW = col.width - 2 * padX;
            doc.text(col.header.toUpperCase(), textX, startY + (maxHeaderHeight - doc.currentLineHeight()) / 2, {
                width: textW,
                align,
            });
            currentX += col.width;
        }
        return startY + maxHeaderHeight;
    };
    // 5. Initial First Page Setup
    let currentY = drawPageHeader(true);
    currentY = drawTableHeader(currentY);
    // 6. Stream Data Rows via MongoDB Cursor with Dynamic Row Height & Auto-Wrap
    for await (const docData of dataCursor) {
        totalRowCount++;
        // Calculate formatted values and dynamic row height for multi-line text (e.g. REMARKS, NAMES)
        doc.fontSize(8).font("Helvetica");
        const cellValues = [];
        let dynamicRowHeight = 18; // default min height
        for (const col of columns) {
            const rawVal = docData[col.key];
            let displayVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : "-";
            let isCurr = false;
            let rawNum = 0;
            if (col.isDate && rawVal) {
                displayVal = formatDateToDisplay(rawVal);
            }
            else if (col.isCurrency) {
                isCurr = true;
                rawNum = Number(rawVal) || 0;
                if (sumColumnKeys.includes(col.key)) {
                    totalsTracker[col.key] = (totalsTracker[col.key] || 0) + rawNum;
                }
                displayVal = formatCurrency(rawNum);
            }
            const align = col.align || (col.isCurrency ? "right" : "left");
            const padX = 4;
            const textW = col.width - 2 * padX;
            // Calculate dynamic text height for auto-wrapped strings (REMARKS, MEMBER NAME, CATEGORY)
            const textHeight = doc.heightOfString(displayVal, { width: textW }) + 8;
            if (textHeight > dynamicRowHeight) {
                dynamicRowHeight = textHeight;
            }
            // Color determination
            let color = "#1E293B";
            if (col.isCurrency && rawNum > 0) {
                color = "#046A38";
            }
            else if (col.isCurrency && rawNum < 0) {
                color = "#DC2626";
            }
            else if (col.key === "status") {
                const s = String(rawVal).toLowerCase();
                if (s === "active" || s === "paid" || s === "running") {
                    color = "#046A38";
                }
                else if (s === "inactive" || s === "due" || s === "closed") {
                    color = "#DC2626";
                }
                else {
                    color = "#475569";
                }
            }
            cellValues.push({ displayVal, align, isCurr, rawNum, color });
        }
        // Page overflow check
        if (currentY + dynamicRowHeight > bottomBoundary) {
            doc.addPage();
            currentPageNumber++;
            currentY = drawPageHeader(false);
            currentY = drawTableHeader(currentY);
        }
        const isEven = totalRowCount % 2 === 0;
        if (isEven) {
            doc.rect(margin, currentY, contentWidth, dynamicRowHeight).fill("#F8FAFC");
        }
        // Border line bottom
        doc
            .strokeColor("#E2E8F0")
            .lineWidth(0.5)
            .moveTo(margin, currentY + dynamicRowHeight)
            .lineTo(margin + contentWidth, currentY + dynamicRowHeight)
            .stroke();
        let cellX = margin;
        doc.fontSize(8);
        for (let cIdx = 0; cIdx < columns.length; cIdx++) {
            const col = columns[cIdx];
            const cellInfo = cellValues[cIdx];
            if (!col || !cellInfo)
                continue;
            const padX = 4;
            const textX = cellX + padX;
            const textW = col.width - 2 * padX;
            if (cellInfo.isCurr) {
                doc.font("Helvetica-Bold");
            }
            else if (col.key === "status") {
                doc.font("Helvetica-Bold");
            }
            else {
                doc.font("Helvetica");
            }
            doc.fillColor(cellInfo.color);
            doc.text(cellInfo.displayVal, textX, currentY + 4, {
                width: textW,
                align: cellInfo.align,
                lineBreak: true, // Auto-wrap text so multi-line text expands row height without overflow
            });
            cellX += col.width;
        }
        currentY += dynamicRowHeight;
    }
    // 7. Auto-Apply Dynamic Summary Row with Full-Width Merged colSpan Header & 6px Padding
    if (sumColumnKeys.length > 0 && totalRowCount > 0) {
        const summaryRowHeight = 26; // Dynamic height with 6px vertical padding
        if (currentY + summaryRowHeight > bottomBoundary) {
            doc.addPage();
            currentY = drawPageHeader(false);
            currentY = drawTableHeader(currentY);
        }
        doc
            .rect(margin, currentY, contentWidth, summaryRowHeight)
            .fill("#F1F5F9");
        doc
            .strokeColor("#0E3B6C")
            .lineWidth(1)
            .moveTo(margin, currentY)
            .lineTo(margin + contentWidth, currentY)
            .moveTo(margin, currentY + summaryRowHeight)
            .lineTo(margin + contentWidth, currentY + summaryRowHeight)
            .stroke();
        // Identify first sum column to create merged label box (colSpan equivalent)
        const firstSumIndex = columns.findIndex((c) => sumColumnKeys.includes(c.key));
        let mergedLabelWidth = 0;
        const labelEndIdx = firstSumIndex > 0 ? firstSumIndex : 1;
        for (let i = 0; i < labelEndIdx; i++) {
            const col = columns[i];
            if (col) {
                mergedLabelWidth += col.width;
            }
        }
        // Print merged full-width total label
        doc
            .fontSize(8.5)
            .font("Helvetica-Bold")
            .fillColor("#0E3B6C")
            .text(grandTotalLabel.toUpperCase(), margin + 6, currentY + 6, {
            width: mergedLabelWidth - 12,
            align: "left",
        });
        let sumX = margin;
        for (let cIdx = 0; cIdx < columns.length; cIdx++) {
            const col = columns[cIdx];
            if (!col)
                continue;
            if (cIdx >= labelEndIdx && sumColumnKeys.includes(col.key)) {
                const padX = 4;
                const textX = sumX + padX;
                const textW = col.width - 2 * padX;
                const align = col.align || "right";
                const sumVal = totalsTracker[col.key] || 0;
                doc
                    .fontSize(8.5)
                    .font("Helvetica-Bold")
                    .fillColor("#C0262D") // Crimson Red #C0262D
                    .text(formatCurrency(sumVal), textX, currentY + 6, {
                    width: textW,
                    align,
                });
            }
            sumX += col.width;
        }
        currentY += summaryRowHeight;
    }
    // 8. Dynamic Page Numbering, Disclaimer Note & Brand Dual-Color Bottom Accent Bar
    const pages = doc.bufferedPageRange();
    const totalPages = pages.count;
    for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        const footerY = pageHeight - margin - 18;
        // Thin top border
        doc
            .strokeColor("#E2E8F0")
            .lineWidth(0.5)
            .moveTo(margin, footerY - 5)
            .lineTo(margin + contentWidth, footerY - 5)
            .stroke();
        // Footer Left: System Identification & Disclaimer
        doc
            .fontSize(7)
            .font("Helvetica")
            .fillColor("#94A3B8")
            .text(`Generated: ${formatDateTime(new Date())}  |  Printed By: ${printedBy}  |  ${organizationName}`, margin, footerY, { width: contentWidth * 0.7, align: "left" });
        // Footer Right: Dynamic "Page X of Y"
        doc
            .fontSize(7.5)
            .font("Helvetica-Bold")
            .fillColor("#0E3B6C")
            .text(`Page ${i + 1} of ${totalPages}`, margin, footerY, {
            width: contentWidth,
            align: "right",
        });
        // Auto-generated disclaimer note
        doc
            .fontSize(6.5)
            .font("Helvetica")
            .fillColor("#64748B")
            .text("This is an auto-generated document, no signature required.", margin, footerY + 9, { width: contentWidth, align: "left" });
        // Dual-Tone Bottom Accent Bar (Crimson Red Left 50% + Deep Navy Right 50%)
        const barY = pageHeight - 5;
        const halfWidth = pageWidth / 2;
        doc.rect(0, barY, halfWidth, 5).fill("#C0262D");
        doc.rect(halfWidth, barY, halfWidth, 5).fill("#0E3B6C");
    }
    // 9. Finalize and close stream
    doc.end();
}
/**
 * Format currency with BDT symbol (BDT #,##0.00)
 */
function formatCurrency(amount) {
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
function formatDateToDisplay(val) {
    try {
        const d = new Date(val);
        if (isNaN(d.getTime()))
            return String(val);
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
    }
    catch {
        return String(val);
    }
}
/**
 * Format Date & Time for headers and footers
 */
function formatDateTime(d) {
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
    }
    catch {
        return d.toISOString();
    }
}
//# sourceMappingURL=reportPdfStream.service.js.map