"use client";

import { PageHero } from "@/components/PageHero";
import { CouncilPageContent } from "@/components/sections/CouncilPageContent";
import type { RoleOption } from "@/components/sections/CouncilPageContent";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCouncilApi } from "@/lib/memberApi";

// ─── Role filter pills (9 roles, 3 rows of 3) ─────────────────────────────────
const EXECUTIVE_ROLES: RoleOption[] = [
  { label: "Executive Member",          labelBn: "নির্বাহী সদস্য" },
  { label: "Founding member",           labelBn: "প্রতিষ্ঠাতা সদস্য" },
  { label: "President",                 labelBn: "সভাপতি" },
  { label: "Vice-President",            labelBn: "সহ-সভাপতি" },
  { label: "General Secretary",         labelBn: "সাধারণ সম্পাদক" },
  { label: "Joint General Secretary",   labelBn: "যুগ্ম সাধারণ সম্পাদক" },
  { label: "Office Secretary",          labelBn: "দফতর সম্পাদক" },
  { label: "Publicity Secretary",       labelBn: "প্রচার সম্পাদক" },
  { label: "Assistant Publicity Secretary", labelBn: "সহকারী প্রচার সম্পাদক" },
];

const EXECUTIVE_RESPONSIBILITIES = [
  {
    num: "1",
    title: "Formulating plans and making decisions to achieve the organization's goals.",
    titleBn: "সংগঠনের লক্ষ্য অর্জনের জন্য পরিকল্পনা প্রণয়ন ও সিদ্ধান্ত গ্রহণ।",
    text: "The method for constituting the governing body is stipulated in the constitution. This can be through direct voting, nomination, or a selection committee.",
    textBn: "পরিচালনা পর্ষদ গঠনের পদ্ধতি সংবিধানে উল্লেখ রয়েছে। এটি প্রত্যক্ষ ভোট, মনোনয়ন বা নির্বাচন কমিটির মাধ্যমে হতে পারে।",
  },
  {
    num: "2",
    title: "Ensuring compliance with legal and organizational governance regulations.",
    titleBn: "আইনি ও সাংগঠনিক শাসন সংক্রান্ত নিয়মাবলী মেনে চলা নিশ্চিতকরণ।",
    text: "All operational strategies and policies are executed transparently and in full alignment with the constitution approved by general assembly members.",
    textBn: "সমস্ত কৌশল ও নীতিমালা সাধারণ পরিষদের সদস্যদের দ্বারা অনুমোদিত সংবিধানের সাথে সামঞ্জস্য রেখে স্বচ্ছভাবে পরিচালিত হয়।",
  },
];

export function ExecutiveCouncilPageClient() {
  const { t } = useTranslation();

  const { data: dynamicMembers = [] } = useQuery({
    queryKey: ["public-council", "core_leadership"],
    queryFn: () => fetchPublicCouncilApi({ category: "core_leadership" }),
  });

  const displayMembers: DirectoryMember[] = (dynamicMembers || []).map((m: any) => ({
    id: m._id,
    memberId: m.memberId || (m.memberCode?.startsWith("ID-") ? m.memberCode : `ID-${m.memberCode || "001"}`),
    name: m.name?.en || m.fullName || "Member",
    nameBn: m.name?.bn || m.fullName,
    role: m.roleTitle?.en || m.designation || "Executive Member",
    roleBn: m.roleTitle?.bn || m.designationBn || "নির্বাহী সদস্য",
    location: `${m.thana ? m.thana + ", " : ""}${m.district || m.division || "Patuakhali"}`,
    dob: m.dateOfBirth || "",
    bloodGroup: m.bloodGroup ? `${m.bloodGroup} (Positive)` : "N/A",
    image: m.photoUrl || m.pictureUrl || "",
  }));

  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("executive_page_crumb") },
        ]}
        titleLine1={t("executive_page_title")}
      />
      <CouncilPageContent
        headingTitle="Core Leadership"
        headingTitleBn="মূল নেতৃত্ব"
        roleOptions={EXECUTIVE_ROLES}
        defaultRole="Executive Member"
        members={displayMembers}
        roleDescription="The responsibility of executive members is generally to ensure the smooth operation of an organization or committee and to assist in achieving its objectives."
        roleDescriptionBn="নির্বাহী সদস্যদের মূল দায়িত্ব হলো সংগঠনের মসৃণ কার্যক্রম পরিচালনা নিশ্চিত করা এবং লক্ষ্য অর্জনে সহায়তা করা।"
        responsibilities={EXECUTIVE_RESPONSIBILITIES}
      />
    </div>
  );
}
