import type { Metadata } from "next";
import { NoticeScheduleListView } from "@/components/notice-schedule/NoticeScheduleListView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Notice Schedule | Friends Goal",
  description: "Publish fee reminders, important notices, invitations, and member meetings.",
};

export default function NoticeSchedulePage() {
  return (
    <RoleGuard allowedRoles={["superadmin", "admin", "manager"]} redirectMemberTo="/dashboard">
      <NoticeScheduleListView />
    </RoleGuard>
  );
}
