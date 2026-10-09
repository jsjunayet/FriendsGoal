import type { Metadata } from "next";
import { GoogleFormEmbedView } from "@/components/forms/GoogleFormEmbedView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Embedded Form | Friends Goal",
  description: "Fill out the official Friends Goal form directly within the portal.",
};

interface FormEmbedPageProps {
  params: Promise<{ id: string }>;
}

export default async function FormEmbedPage({ params }: FormEmbedPageProps) {
  const resolvedParams = await params;
  return (
    <RoleGuard allowedRoles={["member", "manager", "admin", "superadmin"]} redirectMemberTo="/login">
      <GoogleFormEmbedView formId={resolvedParams.id} />
    </RoleGuard>
  );
}
