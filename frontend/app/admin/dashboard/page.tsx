import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Admin Dashboard | Friends Goal",
  description: "Friends Goal administration and financial overview.",
};

export default function AdminDashboardPage() {
  return <DashboardContent />;
}
