"use client";

import { PageHero } from "@/components/PageHero";
import { CouncilPageContent } from "@/components/sections/CouncilPageContent";
import type { RoleOption } from "@/components/sections/CouncilPageContent";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCouncilApi } from "@/lib/memberApi";

const FINANCIAL_ROLES: RoleOption[] = [
  { label: "Financial Member",  labelBn: "আর্থিক সদস্য" },
  { label: "Treasurer",         labelBn: "কোষাধ্যক্ষ" },
  { label: "Financial Auditor", labelBn: "আর্থিক নিরীক্ষক" },
];

const FINANCIAL_MEMBERS: DirectoryMember[] = [
  { id: "fin-1", memberId: "ID-009", name: "MD. FAZLE RABBI",   role: "Treasurer",         location: "Dhanmondi, Dhaka", dob: "25 May 1994", bloodGroup: "AB+ (Positive)", image: "/images/about/about-1.png" },
  { id: "fin-2", memberId: "ID-001", name: "MD. AL AMIN",       role: "Financial Member",   location: "Uttara, Dhaka",    dob: "14 Feb 1991", bloodGroup: "B+ (Positive)",  image: "/images/hero/hero-1.png"  },
  { id: "fin-3", memberId: "ID-003", name: "MD. MIRAJUL ISLAM", role: "Financial Auditor",  location: "Mirpur, Dhaka",    dob: "10 Aug 1992", bloodGroup: "A+ (Positive)",  image: "/images/hero/hero-3.png"  },
];

const FINANCIAL_RESPONSIBILITIES = [
  { num: "1", title: "Auditing monthly savings deposits and investment allocations.", titleBn: "মাসিক সঞ্চয় আমানত এবং বিনিয়োগ বরাদ্দ অডিট করা।", text: "Every taka saved by members is accounted for and audited monthly, with transparent financial reports published to all active contributors.", textBn: "সদস্যদের দ্বারা সঞ্চিত প্রতিটি টাকার হিসাব রাখা হয় এবং প্রতি মাসে অডিট করা হয়।" },
  { num: "2", title: "Enforcing interest-free financial ethics and treasury safeguards.", titleBn: "সুদমুক্ত আর্থিক নীতি এবং কোষাগার সুরক্ষা কার্যকর করা।", text: "Financial council members evaluate collective investment projects to guarantee complete compliance with Islamic finance rules.", textBn: "আর্থিক কাউন্সিলের সদস্যরা ইসলামী অর্থায়নের নিয়মকানুনের সম্পূর্ণ সম্মতি নিশ্চিত করতে সামগ্রিক বিনিয়োগ প্রকল্প মূল্যায়ন করেন।" },
];

export function FinancialCouncilPageClient() {
  const { t } = useTranslation();

  const { data: dynamicMembers } = useQuery({
    queryKey: ["public-council", "financial_leadership"],
    queryFn: () => fetchPublicCouncilApi({ category: "financial_leadership" }),
  });

  const displayMembers: DirectoryMember[] =
    dynamicMembers && dynamicMembers.length > 0
      ? dynamicMembers.map((m) => ({
          id: m._id,
          memberId: m.memberCode?.startsWith("ID-") ? m.memberCode : `ID-${m.memberCode || "001"}`,
          name: m.fullName,
          role: m.designation,
          roleBn: m.designationBn,
          location: `${m.thana ? m.thana + ", " : ""}${m.district || m.division || "Dhaka"}`,
          dob: m.dateOfBirth || "25 May 1994",
          bloodGroup: m.bloodGroup ? `${m.bloodGroup} (Positive)` : "AB+ (Positive)",
          image: m.pictureUrl || "/images/about/about-1.png",
        }))
      : FINANCIAL_MEMBERS;

  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("financial_page_crumb") },
        ]}
        titleLine1={t("financial_page_title")}
      />
      <CouncilPageContent
        headingTitle="Financial Leadership"
        headingTitleBn="আর্থিক নেতৃত্ব"
        roleOptions={FINANCIAL_ROLES}
        defaultRole="Financial Member"
        members={displayMembers}
        roleDescription="The responsibility of financial council members is to oversee savings fund distribution, maintain rigorous audit logs, and ensure 100% interest-free compliance across all member investments."
        roleDescriptionBn="আর্থিক কাউন্সিলের সদস্যদের দায়িত্ব হলো সঞ্চয় তহবিল বিতরণ তদারকি করা, সঠিক অডিট লগ বজায় রাখা এবং ১০০% সুদমুক্ত অর্থায়ন নিশ্চিত করা।"
        responsibilities={FINANCIAL_RESPONSIBILITIES}
      />
    </div>
  );
}
