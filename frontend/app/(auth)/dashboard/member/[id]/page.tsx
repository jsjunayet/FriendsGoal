import type { Metadata } from "next";
import { MemberDetailClient } from "./MemberDetailClient";

export const metadata: Metadata = {
  title: "Member Profile | Friends Goal Admin",
  description: "View and edit member profile details",
};

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <MemberDetailClient id={resolvedParams.id} />;
}
