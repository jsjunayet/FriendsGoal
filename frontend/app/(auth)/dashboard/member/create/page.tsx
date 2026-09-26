import type { Metadata } from "next";
import { MemberFormView } from "@/components/member/MemberFormView";

export const metadata: Metadata = {
  title: "Add Member | Friends Goal Admin",
  description: "Register a new member into the Friends Goal organization",
};

export default function CreateMemberPage() {
  return <MemberFormView isCreateMode={true} />;
}
