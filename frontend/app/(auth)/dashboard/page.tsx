import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Member Dashboard | Friends Goal",
  description: "Personal member dashboard and analytics",
};

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={["member", "manager", "admin", "superadmin"]} redirectMemberTo="/login">
      <DashboardContent />
    </RoleGuard>
  );
}
