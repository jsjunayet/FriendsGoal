import type { Metadata } from "next";
import { InvestmentListView } from "@/components/operation/InvestmentListView";

export const metadata: Metadata = {
  title: "Investment Information | Friends Goal Admin",
  description: "Track and manage all investment portfolios, running states, and closing lifecycles.",
};

export default function InvestmentPage() {
  return <InvestmentListView />;
}
