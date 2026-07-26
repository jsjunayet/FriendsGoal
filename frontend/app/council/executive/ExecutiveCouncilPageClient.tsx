"use client";

import { PageHero } from "@/components/PageHero";
import { CouncilPageContent } from "@/components/sections/CouncilPageContent";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

const EXECUTIVE_MEMBERS: DirectoryMember[] = [
  { id: "exec-1", memberId: "ID-002", name: "MD BELAL HOSSAIN", role: "SECRETARY", location: "Rajapur, Patuakhali", dob: "01 Dec 1993", bloodGroup: "O+ (Positive)", image: "/images/hero/hero-2.png" },
  { id: "exec-2", memberId: "ID-002", name: "MD BELAL HOSSAIN", role: "SECRETARY", location: "Rajapur, Patuakhali", dob: "01 Dec 1993", bloodGroup: "O+ (Positive)", image: "/images/hero/hero-2.png" },
  { id: "exec-3", memberId: "ID-002", name: "MD BELAL HOSSAIN", role: "SECRETARY", location: "Rajapur, Patuakhali", dob: "01 Dec 1993", bloodGroup: "O+ (Positive)", image: "/images/hero/hero-2.png" },
];

const EXECUTIVE_RESPONSIBILITIES = [
  { num: "1", title: "Formulating plans and making decisions to achieve the organization's goals.", titleBn: "সংগঠনের লক্ষ্য অর্জনের জন্য পরিকল্পনা প্রণয়ন ও সিদ্ধান্ত গ্রহণ।", text: "The method for constituting the governing body is stipulated in the constitution. This can be through direct voting, nomination, or a selection committee.", textBn: "পরিচালনা পর্ষদ গঠনের পদ্ধতি সংবিধানে উল্লেখ রয়েছে। এটি প্রত্যক্ষ ভোট, মনোনয়ন বা নির্বাচন কমিটির মাধ্যমে হতে পারে।" },
  { num: "2", title: "Ensuring compliance with legal and organizational governance regulations.", titleBn: "আইনি ও সাংগঠনিক শাসন সংক্রান্ত নিয়মাবলী মেনে চলা নিশ্চিতকরণ।", text: "All operational strategies and policies are executed transparently and in full alignment with the constitution approved by general assembly members.", textBn: "সমস্ত কৌশল ও নীতিমালা সাধারণ পরিষদের সদস্যদের দ্বারা অনুমোদিত সংবিধানের সাথে সামঞ্জস্য রেখে স্বচ্ছভাবে পরিচালিত হয়।" },
];

export function ExecutiveCouncilPageClient() {
  const { t, lang } = useTranslation();
  const isBn = lang === "bn";
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("executive_page_crumb") },
        ]}
        titleLine1={t("executive_page_title")}
        description={isBn
          ? "সম্মিলিত শাসন এবং দূরদর্শী নেতৃত্বের নীতি বজায় রেখে ফ্রেন্ডস গোলকে একটি টেকসই ভবিষ্যতের দিকে এগিয়ে নেওয়া।"
          : "Upholding the principles of collective governance and visionary leadership to steer Friends Goal toward a sustainable and impactful future."
        }
      />
      <CouncilPageContent
        headingTitle="Core Leadership"
        headingTitleBn="মূল নেতৃত্ব"
        roleFilterLabel="Executive Member"
        roleFilterLabelBn="নির্বাহী সদস্য"
        members={EXECUTIVE_MEMBERS}
        roleDescription="The responsibility of executive members is generally to ensure the smooth operation of an organization or committee and to assist in achieving its objectives."
        roleDescriptionBn="নির্বাহী সদস্যদের মূল দায়িত্ব হলো সংগঠনের মসৃণ কার্যক্রম পরিচালনা নিশ্চিত করা এবং লক্ষ্য অর্জনে সহায়তা করা।"
        responsibilities={EXECUTIVE_RESPONSIBILITIES}
      />
    </div>
  );
}
