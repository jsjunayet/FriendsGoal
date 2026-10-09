import type { Metadata } from "next";
import { NoticeScheduleCreateView } from "@/components/notice-schedule/NoticeScheduleCreateView";
import { RoleGuard } from "@/components/dashboard/RoleGuard";

export const metadata: Metadata = {
  title: "Create Notice Schedule | Friends Goal",
  description: "Create and publish notice schedules for members.",
};

export default function CreateNoticeSchedulePage() {
  return (
    <RoleGuard allowedRoles={["superadmin", "admin", "manager"]} redirectMemberTo="/dashboard">
      <NoticeScheduleCreateView />
    </RoleGuard>
  );
}
