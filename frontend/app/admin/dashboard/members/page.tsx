import type { Metadata } from "next";
import MembersClient from "./MembersClient";

export const metadata: Metadata = {
  title: "Member Management | Friends Goal Admin",
  description: "Add, update, and manage Friends Goal members.",
};

export default function MembersPage() {
  return <MembersClient />;
}
