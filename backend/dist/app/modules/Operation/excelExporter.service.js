"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDueListExcel = generateDueListExcel;
const exceljs_1 = __importDefault(require("exceljs"));
async function generateDueListExcel(items, filtersSummary = "All Records") {
    const workbook = new exceljs_1.default.Workbook();
    workbook.creator = "Friends Goal";
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Receivables Due List", {
        views: [{ showGridLines: true }],
    });
    // Title rows
    worksheet.mergeCells("A1:E1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Friends Goal — Receivable Due List Report";
    titleCell.font = { name: "Arial", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF00B074" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).height = 36;
    worksheet.mergeCells("A2:E2");
    const subCell = worksheet.getCell("A2");
    subCell.value = `Exported on: ${new Date().toLocaleString()} | Filters: ${filtersSummary}`;
    subCell.font = { name: "Arial", size: 10, italic: true, color: { argb: "FF4B5563" } };
    subCell.alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(2).height = 20;
    worksheet.addRow([]); // Blank row
    // Table Headers
    const headerRow = worksheet.addRow([
        "ID (CODE)",
        "MEMBER NAME",
        "MOBILE NO",
        "DUE AMOUNT (BDT)",
        "STATUS / REMARKS",
    ]);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
    });
    headerRow.getCell(4).alignment = { vertical: "middle", horizontal: "right" };
    // Data rows
    const startDataRow = 5;
    items.forEach((item, index) => {
        const row = worksheet.addRow([
            item.memberCode,
            item.memberName,
            item.mobileNo,
            item.dueAmount,
            item.status,
        ]);
        row.height = 22;
        const isEven = index % 2 === 0;
        const bgColor = isEven ? "FFFFFFFF" : "FFF8FAFC";
        row.eachCell((cell, colNumber) => {
            cell.font = { name: "Arial", size: 10 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
            cell.border = {
                bottom: { style: "thin", color: { argb: "FFF1F5F9" } },
            };
            if (colNumber === 4) {
                cell.numFmt = '#,##0.00 "BDT"';
                cell.alignment = { horizontal: "right" };
                if (item.dueAmount > 0) {
                    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFDC2626" } };
                }
            }
            if (colNumber === 5) {
                if (item.status === "Advance") {
                    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF00B074" } };
                }
                else if (item.status === "Due") {
                    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFDC2626" } };
                }
                else {
                    cell.font = { name: "Arial", size: 10, color: { argb: "FF6B7280" } };
                }
            }
        });
    });
    const endDataRow = startDataRow + items.length - 1;
    // Formula Summary Row
    if (items.length > 0) {
        const totalRow = worksheet.addRow([
            "TOTAL",
            `Total Members: ${items.length}`,
            "",
            { formula: `SUM(D${startDataRow}:D${endDataRow})` },
            "",
        ]);
        totalRow.height = 28;
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { name: "Arial", size: 11, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
            cell.border = {
                top: { style: "medium", color: { argb: "FF94A3B8" } },
                bottom: { style: "double", color: { argb: "FF94A3B8" } },
            };
            if (colNumber === 4) {
                cell.numFmt = '#,##0.00 "BDT"';
                cell.alignment = { horizontal: "right" };
            }
        });
    }
    // Column widths
    worksheet.getColumn(1).width = 16;
    worksheet.getColumn(2).width = 32;
    worksheet.getColumn(3).width = 24;
    worksheet.getColumn(4).width = 26;
    worksheet.getColumn(5).width = 20;
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}
//# sourceMappingURL=excelExporter.service.js.map