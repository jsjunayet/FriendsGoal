import PDFDocument from "pdfkit";
import type { IDueListItem } from "./operation.interface";

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

      // Header Banner
      doc.rect(30, 30, 535, 45).fill("#046A38");
      doc.fillColor("#FFFFFF").fontSize(18).text("Friends Goal Organization", 45, 42);
      doc.fontSize(10).text("Due List Statement Report", 45, 62);

      let currentY = 85;
      doc.fillColor("#64748B").fontSize(9).text(`Filter: ${filtersSummary}`, 30, currentY);
      doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, 380, currentY, { align: "right" });
      currentY += 20;

      // Table Header
      doc.rect(30, currentY, 535, 20).fill("#F1F5F9");
      doc.fillColor("#334155").fontSize(9);
      doc.text("CODE", 35, currentY + 5, { width: 50 });
      doc.text("MEMBER NAME", 90, currentY + 5, { width: 140 });
      doc.text("MOBILE NO", 235, currentY + 5, { width: 90 });
      doc.text("DUE AMOUNT", 330, currentY + 5, { width: 80, align: "right" });
      doc.text("ADVANCE", 415, currentY + 5, { width: 75, align: "right" });
      doc.text("STATUS", 495, currentY + 5, { width: 65, align: "center" });

      currentY += 22;

      let totalDue = 0;

      for (const item of items) {
        if (currentY > 750) {
          doc.addPage();
          currentY = 40;
        }

        const due = Number(item.dueAmount || 0);
        const adv = Number(item.advanceBalance || 0);
        totalDue += due;

        doc.fillColor("#1E293B").fontSize(8.5);
        doc.text(item.memberCode || "-", 35, currentY, { width: 50 });
        doc.text(item.memberName || "-", 90, currentY, { width: 140 });
        doc.text(item.mobileNo || "-", 235, currentY, { width: 90 });
        doc.text(due.toLocaleString(undefined, { minimumFractionDigits: 2 }), 330, currentY, { width: 80, align: "right" });
        doc.text(adv.toLocaleString(undefined, { minimumFractionDigits: 2 }), 415, currentY, { width: 75, align: "right" });

        const statusColor = item.status === "Due" ? "#DC2626" : item.status === "Advance" ? "#059669" : "#64748B";
        doc.fillColor(statusColor).text(item.status || "-", 495, currentY, { width: 65, align: "center" });

        currentY += 16;
        doc.moveTo(30, currentY - 2).lineTo(565, currentY - 2).strokeColor("#E2E8F0").lineWidth(0.5).stroke();
      }

      currentY += 10;
      doc.rect(30, currentY, 535, 25).fill("#F8FAFC");
      doc.fillColor("#0F172A").fontSize(9);
      doc.text(`Total Records: ${items.length}`, 40, currentY + 7);
      doc.text(`Total Due: ${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT`, 330, currentY + 7, { width: 220, align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
