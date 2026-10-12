import type { Metadata } from "next";
import { MemberFormView } from "@/components/member/MemberFormView";

export const metadata: Metadata = {
  title: "Add Member | Friends Goal",
  description: "Register a new member into the Friends Goal organization",
};

export default function MemberAddPage() {
  return <MemberFormView isCreateMode={true} />;
}
