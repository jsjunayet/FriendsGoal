import type { Metadata } from "next";
import { NoticeScheduleListView } from "@/components/notice-schedule/NoticeScheduleListView";

export const metadata: Metadata = {
  title: "Notice Schedule | Friends Goal Admin",
  description: "Publish fee reminders, important notices, invitations, and member meetings.",
};

export default function AdminNoticeSchedulePage() {
  return <NoticeScheduleListView />;
}
