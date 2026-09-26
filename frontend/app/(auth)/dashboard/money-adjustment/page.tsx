import type { Metadata } from "next";
import { MoneyAdjustmentListView } from "@/components/operation/MoneyAdjustmentListView";

export const metadata: Metadata = {
  title: "Money Adjustment | Friends Goal Admin",
  description: "Manage and review financial adjustments.",
};

export default function MoneyAdjustmentPage() {
  return <MoneyAdjustmentListView />;
}
