import type { Metadata } from "next";
import { ExpenseListView } from "@/components/operation/ExpenseListView";

export const metadata: Metadata = {
  title: "Expense Information | Friends Goal Admin",
  description: "View and manage operational expenses, head categories, and vouchers.",
};

export default function ExpensePage() {
  return <ExpenseListView />;
}
