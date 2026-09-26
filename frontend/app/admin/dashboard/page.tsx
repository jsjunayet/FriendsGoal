import type { Metadata } from "next";
import { FinancialAnalyticsView } from "@/components/dashboard/FinancialAnalyticsView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Financial Analytics | Friends Goal Admin",
  description: "Overview of collections, profits and member performance",
};

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin", "superadmin"]} redirectMemberTo="/dashboard/member">
      <FinancialAnalyticsView />
    </RoleGuard>
  );
}
