import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateExpenseView } from "@/components/operation/CreateExpenseView";

export const metadata: Metadata = {
  title: "Create Expense | Friends Goal Admin",
  description: "Record new organization expenses and manage expense heads.",
};

export default function AdminCreateExpensePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-400">Loading form...</div>
      }
    >
      <CreateExpenseView />
    </Suspense>
  );
}
