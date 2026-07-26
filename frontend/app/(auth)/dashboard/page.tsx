import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | Friends Goal",
  description: "Your personal Friends Goal financial summary and ecosystem overview.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
