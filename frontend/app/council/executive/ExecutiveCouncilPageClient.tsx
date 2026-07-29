"use client";

import { PageHero } from "@/components/PageHero";
import { CouncilPageContent } from "@/components/sections/CouncilPageContent";
import type { RoleOption } from "@/components/sections/CouncilPageContent";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

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

// ─── Members (assign role matching the pill labels above) ─────────────────────
const EXECUTIVE_MEMBERS: DirectoryMember[] = [
  {
    id: "exec-1",
    memberId: "ID-001",
    name: "MD BELAL HOSSAIN",
    role: "Executive Member",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-2",
    memberId: "ID-002",
    name: "MD BELAL HOSSAIN",
    role: "Executive Member",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-3",
    memberId: "ID-003",
    name: "MD BELAL HOSSAIN",
    role: "Executive Member",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-4",
    memberId: "ID-004",
    name: "MD BELAL HOSSAIN",
    role: "Founding member",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-5",
    memberId: "ID-005",
    name: "MD BELAL HOSSAIN",
    role: "President",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-6",
    memberId: "ID-006",
    name: "MD BELAL HOSSAIN",
    role: "Vice-President",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-7",
    memberId: "ID-007",
    name: "MD BELAL HOSSAIN",
    role: "General Secretary",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-8",
    memberId: "ID-008",
    name: "MD BELAL HOSSAIN",
    role: "Joint General Secretary",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-9",
    memberId: "ID-009",
    name: "MD BELAL HOSSAIN",
    role: "Office Secretary",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-10",
    memberId: "ID-010",
    name: "MD BELAL HOSSAIN",
    role: "Publicity Secretary",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "exec-11",
    memberId: "ID-011",
    name: "MD BELAL HOSSAIN",
    role: "Assistant Publicity Secretary",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
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
        members={EXECUTIVE_MEMBERS}
        roleDescription="The responsibility of executive members is generally to ensure the smooth operation of an organization or committee and to assist in achieving its objectives."
        roleDescriptionBn="নির্বাহী সদস্যদের মূল দায়িত্ব হলো সংগঠনের মসৃণ কার্যক্রম পরিচালনা নিশ্চিত করা এবং লক্ষ্য অর্জনে সহায়তা করা।"
        responsibilities={EXECUTIVE_RESPONSIBILITIES}
      />
    </div>
  );
}
