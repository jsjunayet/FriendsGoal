"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDueListPdf = generateDueListPdf;
const react_1 = __importDefault(require("react"));
const renderer_1 = require("@react-pdf/renderer");
const styles = renderer_1.StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#1E293B",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottomWidth: 2,
        borderBottomColor: "#00B074",
        paddingBottom: 12,
        marginBottom: 16,
    },
    orgTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#00B074",
        marginBottom: 2,
    },
    orgSubtitle: {
        fontSize: 11,
        color: "#475569",
        fontWeight: "bold",
    },
    metaRight: {
        textAlign: "right",
        fontSize: 8,
        color: "#64748B",
    },
    filterPill: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginTop: 4,
        fontSize: 8,
        color: "#334155",
    },
    table: {
        width: "100%",
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
        paddingVertical: 6,
        paddingHorizontal: 8,
        fontWeight: "bold",
        fontSize: 8.5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E2E8F0",
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 8.5,
    },
    rowEven: {
        backgroundColor: "#F8FAFC",
    },
    rowOdd: {
        backgroundColor: "#FFFFFF",
    },
    colCode: {
        width: "14%",
    },
    colName: {
        width: "32%",
    },
    colMobile: {
        width: "24%",
    },
    colDue: {
        width: "18%",
        textAlign: "right",
    },
    colStatus: {
        width: "12%",
        textAlign: "right",
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F1F5F9",
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        marginTop: 10,
    },
    summaryText: {
        fontSize: 9.5,
        fontWeight: "bold",
        color: "#0F172A",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
        fontSize: 8,
        color: "#94A3B8",
    },
});
function DueListDocument({ items, filtersSummary }) {
    const totalDue = items.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
    return react_1.default.createElement(renderer_1.Document, { title: "Receivable Due List Report", author: "Friends Goal" }, react_1.default.createElement(renderer_1.Page, { size: "A4", style: styles.page }, 
    // Header
    react_1.default.createElement(renderer_1.View, { style: styles.headerContainer }, react_1.default.createElement(renderer_1.View, null, react_1.default.createElement(renderer_1.Text, { style: styles.orgTitle }, "Friends Goal"), react_1.default.createElement(renderer_1.Text, { style: styles.orgSubtitle }, "Receivable Due List Report")), react_1.default.createElement(renderer_1.View, { style: styles.metaRight }, react_1.default.createElement(renderer_1.Text, null, `Date: ${new Date().toLocaleDateString()}`), react_1.default.createElement(renderer_1.Text, { style: styles.filterPill }, `Filters: ${filtersSummary}`))), 
    // Table Header
    react_1.default.createElement(renderer_1.View, { style: styles.table }, react_1.default.createElement(renderer_1.View, { style: styles.tableHeader }, react_1.default.createElement(renderer_1.Text, { style: styles.colCode }, "ID (CODE)"), react_1.default.createElement(renderer_1.Text, { style: styles.colName }, "MEMBER NAME"), react_1.default.createElement(renderer_1.Text, { style: styles.colMobile }, "MOBILE NO"), react_1.default.createElement(renderer_1.Text, { style: styles.colDue }, "DUE AMOUNT"), react_1.default.createElement(renderer_1.Text, { style: styles.colStatus }, "STATUS")), 
    // Table Rows
    ...items.map((item, index) => {
        const isEven = index % 2 === 0;
        return react_1.default.createElement(renderer_1.View, {
            key: `${item.memberCode}-${index}`,
            style: [styles.tableRow, isEven ? styles.rowEven : styles.rowOdd],
        }, react_1.default.createElement(renderer_1.Text, { style: styles.colCode }, item.memberCode), react_1.default.createElement(renderer_1.Text, { style: styles.colName }, item.memberName), react_1.default.createElement(renderer_1.Text, { style: styles.colMobile }, item.mobileNo), react_1.default.createElement(renderer_1.Text, {
            style: [
                styles.colDue,
                item.dueAmount > 0 ? { color: "#DC2626", fontWeight: "bold" } : {},
            ],
        }, `${item.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT`), react_1.default.createElement(renderer_1.Text, {
            style: [
                styles.colStatus,
                item.status === "Advance"
                    ? { color: "#00B074", fontWeight: "bold" }
                    : item.status === "Due"
                        ? { color: "#DC2626", fontWeight: "bold" }
                        : { color: "#64748B" },
            ],
        }, item.status));
    })), 
    // Summary Box
    react_1.default.createElement(renderer_1.View, { style: styles.summaryContainer }, react_1.default.createElement(renderer_1.Text, { style: styles.summaryText }, `Total Records: ${items.length}`), react_1.default.createElement(renderer_1.Text, { style: styles.summaryText }, `Total Due Amount: ${totalDue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
    })} BDT`)), 
    // Footer with page numbering
    react_1.default.createElement(renderer_1.View, { style: styles.footer, fixed: true }, react_1.default.createElement(renderer_1.Text, null, "Friends Goal Organization — Financial Operations Module"), react_1.default.createElement(renderer_1.Text, {
        render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`,
    }))));
}
async function generateDueListPdf(items, filtersSummary = "All Records") {
    const docElement = react_1.default.createElement(DueListDocument, { items, filtersSummary });
    const result = await (0, renderer_1.pdf)(docElement).toBuffer();
    if (Buffer.isBuffer(result)) {
        return result;
    }
    // Handle NodeJS.ReadableStream if returned by @react-pdf/renderer
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = result;
        if (typeof stream.on === "function") {
            stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            stream.on("end", () => resolve(Buffer.concat(chunks)));
            stream.on("error", (err) => reject(err));
        }
        else {
            resolve(Buffer.from(result));
        }
    });
}
//# sourceMappingURL=pdfExporter.service.js.map