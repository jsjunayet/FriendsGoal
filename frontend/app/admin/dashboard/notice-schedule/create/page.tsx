import type { Metadata } from "next";
import { NoticeScheduleCreateView } from "@/components/notice-schedule/NoticeScheduleCreateView";

export const metadata: Metadata = {
  title: "Create Notice Schedule | Friends Goal Admin",
  description: "Create and publish notice schedules for members.",
};

export default function AdminCreateNoticeSchedulePage() {
  return <NoticeScheduleCreateView />;
}
