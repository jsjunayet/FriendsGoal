import type { Metadata } from "next";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | Friends Goal",
  description: "View system notifications, activity alerts, and approval requests.",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
