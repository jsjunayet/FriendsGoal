import type { Metadata } from "next";
import { DueListView } from "@/components/operation/DueListView";

export const metadata: Metadata = {
  title: "Due List | Friends Goal Admin",
  description: "Manage and track member receivables.",
};

export default function DueListPage() {
  return <DueListView />;
}
