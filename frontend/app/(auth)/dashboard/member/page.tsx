import type { Metadata } from "next";
import { MemberListTable } from "@/components/member/MemberListTable";

export const metadata: Metadata = {
  title: "Member Management | Friends Goal Admin",
  description: "Manage and view all registered members",
};

export default function MemberListPage() {
  return <MemberListTable />;
}
