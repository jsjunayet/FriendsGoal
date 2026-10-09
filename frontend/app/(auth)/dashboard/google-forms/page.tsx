import type { Metadata } from "next";
import { GoogleFormManagementView } from "@/components/forms/GoogleFormManagementView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Google Forms Management | Friends Goal Admin",
  description: "Embed and manage Google Forms for members.",
};

export default function GoogleFormsAdminPage() {
  return (
    <RoleGuard allowedRoles={["superadmin", "admin", "manager"]} redirectMemberTo="/dashboard">
      <GoogleFormManagementView />
    </RoleGuard>
  );
}
