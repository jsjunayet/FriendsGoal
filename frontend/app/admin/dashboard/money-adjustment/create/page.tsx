import type { Metadata } from "next";
import { CreateAdjustmentView } from "@/components/operation/CreateAdjustmentView";

export const metadata: Metadata = {
  title: "Create Adjustment | Friends Goal Admin",
  description: "Enter details to manually adjust member balances or operational records.",
};

export default function AdminCreateAdjustmentPage() {
  return <CreateAdjustmentView />;
}
