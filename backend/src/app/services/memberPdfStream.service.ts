import type { Response } from "express";
import PDFDocument from "pdfkit";

// Force bundlers and Vercel NFT to trace and include PDFKit standard fonts
try {
  require("pdfkit/standard-fonts/Helvetica");
  require("pdfkit/standard-fonts/HelveticaBold");
  require("pdfkit/standard-fonts/HelveticaOblique");
  require("pdfkit/standard-fonts/HelveticaBoldOblique");
  require("pdfkit/standard-fonts/Courier");
  require("pdfkit/standard-fonts/CourierBold");
  require("pdfkit/standard-fonts/TimesRoman");
  require("pdfkit/standard-fonts/TimesBold");
  require("pdfkit/standard-fonts/Symbol");
  require("pdfkit/standard-fonts/ZapfDingbats");
} catch (_) {}

import { drawBrandLogo } from "./reportPdfStream.service";
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
export async function streamMemberProfileToPdf(
  res: Response,
  options: IStreamMemberPdfOptions
): Promise<void> {
  const {
    filename,
    organizationName = "Friends Goal",
    website = "www.friendsgoal.com",
    printedBy = "System Administrator",
    data,
  } = options;

  const { member, totalDeposit, profitBalance, pendingWithdrawals, dueAmount, transactions } = data;

  // 1. Set streaming HTTP response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  // 2. Initialize PDFKit
  const doc = new PDFDocument({
    size: "A4",
    margin: 36,
    bufferPages: true,
    info: {
      Title: `Member Profile - ${member.fullName} (${member.memberCode})`,
      Author: organizationName,
      Subject: "Member Master Profile and Financial Ledger",
      CreationDate: new Date(),
    },
  });

  doc.pipe(res);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - 2 * margin; // 523.28 pt
  const bottomBoundary = pageHeight - margin - 35;

  // 3. Header Function
  const drawHeader = (isFirstPage: boolean) => {
    const topY = margin;

    // Logo & Somiti Brand
    drawBrandLogo(doc, margin, topY, 32);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#0E3B6C")
      .text(organizationName, margin + 40, topY + 2);

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor("#64748B")
      .text("Financial Cooperative Society (Somiti)", margin + 40, topY + 18);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#0F172A")
      .text("MEMBER FINANCIAL STATEMENT", margin, topY + 2, {
        width: contentWidth,
        align: "right",
      });

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#C0262D")
      .text(website, margin, topY + 18, {
        width: contentWidth,
        align: "right",
      });

    // Divider Line
    doc
      .strokeColor("#0E3B6C")
      .lineWidth(1.5)
      .moveTo(margin, topY + 38)
      .lineTo(margin + contentWidth, topY + 38)
      .stroke();

    return topY + 46;
  };

  let currentY = drawHeader(true);

  // 4. Two-Column Member Profile Card Layout
  const profileCardHeight = 110;
  doc
    .roundedRect(margin, currentY, contentWidth, profileCardHeight, 6)
    .fillAndStroke("#F8FAFC", "#CBD5E1");

  // Left Column: Member Photo/Avatar & Key Details
  const avatarSize = 44;
  const avatarX = margin + 12;
  const avatarY = currentY + 12;

  // Clean avatar placeholder circle
  doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2).fill("#E2E8F0");
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#046A38")
    .text(
      (member.fullName || "M").charAt(0).toUpperCase(),
      avatarX,
      avatarY + 14,
      { width: avatarSize, align: "center" }
    );

  // Member Name & ID Badge
  const leftTextX = avatarX + avatarSize + 12;
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#0F172A")
    .text(member.fullName || "Member", leftTextX, currentY + 12);

  doc
    .fontSize(8.5)
    .font("Helvetica-Bold")
    .fillColor("#046A38")
    .text(`ID: ${member.memberCode}   |   ${member.designation || "General Member"}`, leftTextX, currentY + 28);

  // Personal contact info
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#475569")
    .text(`Phone: ${member.mobileNo || "-"}`, leftTextX, currentY + 44)
    .text(`Email: ${member.email || "-"}`, leftTextX, currentY + 58)
    .text(`NID: ${member.nidNo || "-"}`, leftTextX, currentY + 72)
    .text(`Address: ${member.presentAddress || "-"}`, leftTextX, currentY + 86, {
      width: 170,
      ellipsis: true,
    });

  // Vertical Divider in Profile Card
  const colDividerX = margin + 270;
  doc
    .strokeColor("#E2E8F0")
    .lineWidth(1)
    .moveTo(colDividerX, currentY + 10)
    .lineTo(colDividerX, currentY + profileCardHeight - 10)
    .stroke();

  // Right Column: Nominee & Status Details
  const rightTextX = colDividerX + 14;
  doc
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .fillColor("#0F172A")
    .text("Nominee & Account Details", rightTextX, currentY + 12);

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#475569")
    .text(`Nominee Name: ${member.nomineeName || "N/A"}`, rightTextX, currentY + 30)
    .text(`Relationship: ${member.nomineeRelation || "N/A"}`, rightTextX, currentY + 44)
    .text(`Nominee NID: ${member.nomineeNid || "N/A"}`, rightTextX, currentY + 58)
    .text(`Joined Date: ${formatDate(member.createdAt)}`, rightTextX, currentY + 72);

  // Status Badge
  const isMemberActive = String(member.status).toLowerCase() === "active";
  doc
    .roundedRect(rightTextX, currentY + 86, 60, 16, 3)
    .fill(isMemberActive ? "#EAF8F1" : "#FEE2E2");

  doc
    .fontSize(7.5)
    .font("Helvetica-Bold")
    .fillColor(isMemberActive ? "#00B074" : "#DC2626")
    .text(String(member.status || "Active").toUpperCase(), rightTextX, currentY + 90, {
      width: 60,
      align: "center",
    });

  currentY += profileCardHeight + 12;

  // 5. Four Financial Summary Cards (KPI Badges)
  const cardGap = 8;
  const numCards = 4;
  const cardWidth = (contentWidth - (numCards - 1) * cardGap) / numCards; // ~124 pt
  const cardHeight = 44;

  const kpiData = [
    { label: "TOTAL DEPOSIT", value: formatCurrency(totalDeposit), color: "#0E3B6C", bg: "#F1F5F9" },
    { label: "PROFIT BALANCE", value: formatCurrency(profitBalance), color: "#0288D1", bg: "#EFF6FF" },
    { label: "PENDING WITHDRAWAL", value: formatCurrency(pendingWithdrawals), color: "#D97706", bg: "#FFFBEB" },
    { label: "CURRENT DUE", value: formatCurrency(dueAmount), color: "#C0262D", bg: "#FEF2F2" },
  ];

  kpiData.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + cardGap);
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 4).fillAndStroke(kpi.bg, "#CBD5E1");

    doc
      .fontSize(6.8)
      .font("Helvetica-Bold")
      .fillColor("#64748B")
      .text(kpi.label, cardX + 6, currentY + 8, { width: cardWidth - 12, align: "center" });

    doc
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .fillColor(kpi.color)
      .text(kpi.value, cardX + 6, currentY + 22, { width: cardWidth - 12, align: "center" });
  });

  currentY += cardHeight + 16;

  // 6. Itemized Financial Transaction History Table
  doc
    .fontSize(10.5)
    .font("Helvetica-Bold")
    .fillColor("#0F172A")
    .text("TRANSACTION & PAYMENT HISTORY", margin, currentY);

  currentY += 14;

  const tableColumns = [
    { header: "DATE", width: 68, align: "left" as const },
    { header: "TYPE", width: 80, align: "left" as const },
    { header: "REF / RECEIPT", width: 85, align: "left" as const },
    { header: "AMOUNT", width: 80, align: "right" as const },
    { header: "STATUS", width: 60, align: "center" as const },
    { header: "REMARKS", width: 150, align: "left" as const },
  ];

  const drawTableHeader = (y: number): number => {
    const rowHeight = 20;
    doc.roundedRect(margin, y, contentWidth, rowHeight, 2).fill("#0E3B6C");

    let colX = margin;
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#FFFFFF");

    tableColumns.forEach((col) => {
      const padX = 4;
      doc.text(col.header, colX + padX, y + 5.5, {
        width: col.width - 2 * padX,
        align: col.align,
      });
      colX += col.width;
    });

    return y + rowHeight;
  };

  currentY = drawTableHeader(currentY);

  if (transactions.length === 0) {
    doc.rect(margin, currentY, contentWidth, 24).fill("#F8FAFC");
    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor("#64748B")
      .text("No transaction history recorded for this member.", margin, currentY + 7, {
        width: contentWidth,
        align: "center",
      });
    currentY += 24;
  } else {
    transactions.forEach((tx, idx) => {
      const remarksText = tx.remarks || "-";
      doc.fontSize(7.5).font("Helvetica");
      const remarksHeight = doc.heightOfString(remarksText, { width: 150 - 8 }) + 8;
      const dynamicRowHeight = Math.max(18, remarksHeight);

      if (currentY + dynamicRowHeight > bottomBoundary) {
        doc.addPage();
        currentY = drawHeader(false);
        currentY = drawTableHeader(currentY);
      }

      const isEven = idx % 2 === 0;
      if (isEven) {
        doc.rect(margin, currentY, contentWidth, dynamicRowHeight).fill("#F8FAFC");
      }

      doc
        .strokeColor("#E2E8F0")
        .lineWidth(0.5)
        .moveTo(margin, currentY + dynamicRowHeight)
        .lineTo(margin + contentWidth, currentY + dynamicRowHeight)
        .stroke();

      let cellX = margin;
      const amountVal = Number(tx.amount) || 0;

      // Date
      doc.fontSize(7.5).font("Helvetica").fillColor("#1E293B");
      doc.text(formatDate(tx.date), cellX + 4, currentY + 4, { width: 68 - 8, lineBreak: true });
      cellX += 68;

      // Type
      doc.text(tx.type || "-", cellX + 4, currentY + 4, { width: 80 - 8, lineBreak: true });
      cellX += 80;

      // Ref / Receipt
      doc.text(tx.reference || "-", cellX + 4, currentY + 4, { width: 85 - 8, lineBreak: true });
      cellX += 85;

      // Amount
      doc
        .font("Helvetica-Bold")
        .fillColor(amountVal >= 0 ? "#046A38" : "#DC2626")
        .text(formatCurrency(amountVal), cellX + 4, currentY + 4, {
          width: 80 - 8,
          align: "right",
          lineBreak: true,
        });
      cellX += 80;

      // Status
      const statusLower = String(tx.status).toLowerCase();
      const statusColor =
        statusLower === "paid" || statusLower === "approved"
          ? "#046A38"
          : statusLower === "pending"
          ? "#D97706"
          : "#DC2626";

      doc.font("Helvetica-Bold").fillColor(statusColor);
      doc.text(String(tx.status || "Completed").toUpperCase(), cellX + 4, currentY + 4, {
        width: 60 - 8,
        align: "center",
        lineBreak: true,
      });
      cellX += 60;

      // Remarks (Auto-wrapped dynamic text)
      doc.font("Helvetica").fillColor("#475569");
      doc.text(remarksText, cellX + 4, currentY + 4, { width: 150 - 8, align: "left", lineBreak: true });

      currentY += dynamicRowHeight;
    });
  }

  // 7. Dynamic Page Numbering & Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    const footerY = pageHeight - margin - 18;

    doc
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .moveTo(margin, footerY - 5)
      .lineTo(margin + contentWidth, footerY - 5)
      .stroke();

    doc
      .fontSize(7)
      .font("Helvetica")
      .fillColor("#94A3B8")
      .text(
        `Generated: ${new Date().toLocaleString()}  |  Printed By: ${printedBy}  |  ${organizationName}`,
        margin,
        footerY,
        { width: contentWidth * 0.7, align: "left" }
      );

    doc
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .fillColor("#0E3B6C")
      .text(`Page ${i + 1} of ${pages.count}`, margin, footerY, {
        width: contentWidth,
        align: "right",
      });

    // Auto-generated disclaimer note
    doc
      .fontSize(6.5)
      .font("Helvetica")
      .fillColor("#64748B")
      .text(
        "This is an auto-generated document, no signature required.",
        margin,
        footerY + 9,
        { width: contentWidth, align: "left" }
      );

    // Dual-Tone Bottom Accent Bar (Crimson Red Left 50% + Deep Navy Right 50%)
    const barY = pageHeight - 5;
    const halfWidth = pageWidth / 2;
    doc.rect(0, barY, halfWidth, 5).fill("#C0262D");
    doc.rect(halfWidth, barY, halfWidth, 5).fill("#0E3B6C");
  }

  doc.end();
}

function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-BDT ${formatted}` : `BDT ${formatted}`;
}

function formatDate(val: any): string {
  try {
    if (!val) return "-";
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
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  } catch {
    return String(val);
  }
}
