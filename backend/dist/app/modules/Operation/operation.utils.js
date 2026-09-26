"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceiptCode = generateReceiptCode;
exports.formatMonthYear = formatMonthYear;
function generateReceiptCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 8; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RCP-${randomPart}`;
}
function formatMonthYear(date = new Date()) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month}-${year}`;
}
//# sourceMappingURL=operation.utils.js.map