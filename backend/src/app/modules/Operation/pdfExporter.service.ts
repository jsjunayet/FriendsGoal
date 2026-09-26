import React from "react";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { IDueListItem } from "./operation.interface";

const styles = StyleSheet.create({
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

interface DueListPdfProps {
  items: IDueListItem[];
  filtersSummary: string;
}

function DueListDocument({ items, filtersSummary }: DueListPdfProps) {
  const totalDue = items.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);

  return React.createElement(
    Document,
    { title: "Receivable Due List Report", author: "Friends Goal" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.headerContainer },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.orgTitle }, "Friends Goal"),
          React.createElement(Text, { style: styles.orgSubtitle }, "Receivable Due List Report")
        ),
        React.createElement(
          View,
          { style: styles.metaRight },
          React.createElement(Text, null, `Date: ${new Date().toLocaleDateString()}`),
          React.createElement(
            Text,
            { style: styles.filterPill },
            `Filters: ${filtersSummary}`
          )
        )
      ),

      // Table Header
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(Text, { style: styles.colCode }, "ID (CODE)"),
          React.createElement(Text, { style: styles.colName }, "MEMBER NAME"),
          React.createElement(Text, { style: styles.colMobile }, "MOBILE NO"),
          React.createElement(Text, { style: styles.colDue }, "DUE AMOUNT"),
          React.createElement(Text, { style: styles.colStatus }, "STATUS")
        ),

        // Table Rows
        ...items.map((item, index) => {
          const isEven = index % 2 === 0;
          return React.createElement(
            View,
            {
              key: `${item.memberCode}-${index}`,
              style: [styles.tableRow, isEven ? styles.rowEven : styles.rowOdd],
            },
            React.createElement(Text, { style: styles.colCode }, item.memberCode),
            React.createElement(Text, { style: styles.colName }, item.memberName),
            React.createElement(Text, { style: styles.colMobile }, item.mobileNo),
            React.createElement(
              Text,
              {
                style: [
                  styles.colDue,
                  item.dueAmount > 0 ? { color: "#DC2626", fontWeight: "bold" } : {},
                ],
              },
              `${item.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} BDT`
            ),
            React.createElement(
              Text,
              {
                style: [
                  styles.colStatus,
                  item.status === "Advance"
                    ? { color: "#00B074", fontWeight: "bold" }
                    : item.status === "Due"
                    ? { color: "#DC2626", fontWeight: "bold" }
                    : { color: "#64748B" },
                ],
              },
              item.status
            )
          );
        })
      ),

      // Summary Box
      React.createElement(
        View,
        { style: styles.summaryContainer },
        React.createElement(
          Text,
          { style: styles.summaryText },
          `Total Records: ${items.length}`
        ),
        React.createElement(
          Text,
          { style: styles.summaryText },
          `Total Due Amount: ${totalDue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })} BDT`
        )
      ),

      // Footer with page numbering
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          null,
          "Friends Goal Organization — Financial Operations Module"
        ),
        React.createElement(Text, {
          render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`,
        })
      )
    )
  );
}

export async function generateDueListPdf(
  items: IDueListItem[],
  filtersSummary: string = "All Records"
): Promise<Buffer> {
  const docElement = React.createElement(DueListDocument, { items, filtersSummary });
  const result = await pdf(docElement as any).toBuffer();

  if (Buffer.isBuffer(result)) {
    return result;
  }

  // Handle NodeJS.ReadableStream if returned by @react-pdf/renderer
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = result as any;
    if (typeof stream.on === "function") {
      stream.on("data", (chunk: any) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      );
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (err: any) => reject(err));
    } else {
      resolve(Buffer.from(result as any));
    }
  });
}
