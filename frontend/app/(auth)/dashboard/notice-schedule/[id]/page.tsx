import type { Metadata } from "next";
import { NoticeDetailView } from "@/components/notice-schedule/NoticeDetailView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Notice Details | Friends Goal",
  description: "View official published notice and schedule information.",
};

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const resolvedParams = await params;
  return (
    <RoleGuard allowedRoles={["member", "manager", "admin", "superadmin"]} redirectMemberTo="/login">
      <NoticeDetailView noticeId={resolvedParams.id} />
    </RoleGuard>
  );
}
