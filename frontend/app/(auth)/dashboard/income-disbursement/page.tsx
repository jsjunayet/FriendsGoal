import type { Metadata } from "next";
import { DisbursementListView } from "@/components/operation/DisbursementListView";

export const metadata: Metadata = {
  title: "Income Disbursement | Friends Goal Admin",
  description: "Manage and review member income disbursements and payouts.",
};

export default function IncomeDisbursementPage() {
  return <DisbursementListView />;
}
