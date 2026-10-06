import PDFDocument from "pdfkit";
import type { IDueListItem } from "./operation.interface";

/**
 * Lead Frontend Engineer - Dynamic PDF Generation System
 * Generates due list PDF with dynamic cell heights, auto-wrapping text,
 * protected header cells, balanced column ratios, and merged summary footer.
 */
export async function generateDueListPdf(
  items: IDueListItem[],
  filtersSummary: string = "All Records"
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const margin = 30;
      const contentWidth = 535; // 595.28 - 2 * 30
      const bottomBoundary = 780;

      // 1. Header Banner
      doc.rect(margin, margin, contentWidth, 45).fill("#046A38");
      doc.fillColor("#FFFFFF").fontSize(18).font("Helvetica-Bold").text("Friends Goal Organization", 45, 40);
      doc.fontSize(9.5).font("Helvetica").text("Due List Statement Report", 45, 60);

      let currentY = 85;
      doc.fillColor("#64748B").fontSize(8.5).font("Helvetica").text(`Filter: ${filtersSummary}`, margin, currentY);
      doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, 350, currentY, { width: 215, align: "right" });
      currentY += 20;

      // 2. Column Ratios & Definitions
      // CODE (~8%), MEMBER NAME (~25%), MOBILE NO (~15%), DUE AMOUNT (~17%), ADVANCE (~17%), STATUS (~18%)
      const columns = [
        { header: "CODE", width: 43, align: "center" as const },
        { header: "MEMBER NAME", width: 134, align: "left" as const },
        { header: "MOBILE NO", width: 80, align: "left" as const },
        { header: "DUE AMOUNT", width: 91, align: "right" as const },
        { header: "ADVANCE", width: 91, align: "right" as const },
        { header: "STATUS", width: 96, align: "center" as const },
      ];

      const drawHeaderRow = (y: number): number => {
        const headerHeight = 22;
        doc.rect(margin, y, contentWidth, headerHeight).fill("#F1F5F9");
        doc.fillColor("#334155").fontSize(8.5).font("Helvetica-Bold");

        let colX = margin;
        for (const col of columns) {
          const padX = 4;
          doc.text(col.header, colX + padX, y + 6, {
            width: col.width - 2 * padX,
            align: col.align,
          });
          colX += col.width;
        }

        return y + headerHeight;
      };

      currentY = drawHeaderRow(currentY);

      let totalDue = 0;
      let totalAdvance = 0;

      // 3. Body Rows with Dynamic Cell Heights & Word Wrapping
      for (const item of items) {
        const due = Number(item.dueAmount || 0);
        const adv = Number(item.advanceBalance || 0);
        totalDue += due;
        totalAdvance += adv;

        const codeText = item.memberCode || "-";
        const nameText = item.memberName || "-";
        const mobileText = item.mobileNo || "-";
        const dueText = due.toLocaleString(undefined, { minimumFractionDigits: 2 });
        const advText = adv.toLocaleString(undefined, { minimumFractionDigits: 2 });
        const statusText = item.status || "-";

        // Calculate dynamic height based on content wrapping
        doc.fontSize(8).font("Helvetica");
        const nameHeight = doc.heightOfString(nameText, { width: 134 - 8 }) + 8;
        const dynamicRowHeight = Math.max(18, nameHeight);

        if (currentY + dynamicRowHeight > bottomBoundary) {
          doc.addPage();
          currentY = drawHeaderRow(40);
        }

        // Row background line
        doc
          .strokeColor("#E2E8F0")
          .lineWidth(0.5)
          .moveTo(margin, currentY + dynamicRowHeight)
          .lineTo(margin + contentWidth, currentY + dynamicRowHeight)
          .stroke();

        let cellX = margin;

        // CODE
        doc.fillColor("#1E293B").font("Helvetica");
        doc.text(codeText, cellX + 4, currentY + 4, { width: 43 - 8, align: "center", lineBreak: true });
        cellX += 43;

        // MEMBER NAME (Auto-wrapping text)
        doc.font("Helvetica-Bold");
        doc.text(nameText, cellX + 4, currentY + 4, { width: 134 - 8, align: "left", lineBreak: true });
        cellX += 134;

        // MOBILE NO
        doc.font("Helvetica");
        doc.text(mobileText, cellX + 4, currentY + 4, { width: 80 - 8, align: "left", lineBreak: true });
        cellX += 80;

        // DUE AMOUNT
        doc.font("Helvetica-Bold").fillColor(due > 0 ? "#DC2626" : "#1E293B");
        doc.text(dueText, cellX + 4, currentY + 4, { width: 91 - 8, align: "right", lineBreak: true });
        cellX += 91;

        // ADVANCE
        doc.font("Helvetica-Bold").fillColor(adv > 0 ? "#046A38" : "#1E293B");
        doc.text(advText, cellX + 4, currentY + 4, { width: 91 - 8, align: "right", lineBreak: true });
        cellX += 91;

        // STATUS
        const statusColor = statusText === "Due" ? "#DC2626" : statusText === "Advance" ? "#046A38" : "#64748B";
        doc.font("Helvetica-Bold").fillColor(statusColor);
        doc.text(statusText.toUpperCase(), cellX + 4, currentY + 4, { width: 96 - 8, align: "center", lineBreak: true });

        currentY += dynamicRowHeight;
      }

      // 4. Dynamic Summary Footer Row with Merged colSpan Title Cell & 6px Padding
      const footerHeight = 26;
      if (currentY + footerHeight > bottomBoundary) {
        doc.addPage();
        currentY = 40;
      }

      doc.rect(margin, currentY, contentWidth, footerHeight).fill("#E8F5E9");
      doc
        .strokeColor("#046A38")
        .lineWidth(1)
        .moveTo(margin, currentY)
        .lineTo(margin + contentWidth, currentY)
        .moveTo(margin, currentY + footerHeight)
        .lineTo(margin + contentWidth, currentY + footerHeight)
        .stroke();

      // Merged Label for non-amount columns (CODE + MEMBER NAME + MOBILE NO = 43 + 134 + 80 = 257pt)
      doc.fillColor("#046A38").fontSize(8.5).font("Helvetica-Bold");
      doc.text(`TOTAL RECORDS (${items.length})`, margin + 6, currentY + 7, { width: 245, align: "left" });

      // Total Due
      doc.text(totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 }), margin + 257 + 4, currentY + 7, {
        width: 91 - 8,
        align: "right",
      });

      // Total Advance
      doc.text(totalAdvance.toLocaleString(undefined, { minimumFractionDigits: 2 }), margin + 257 + 91 + 4, currentY + 7, {
        width: 91 - 8,
        align: "right",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
