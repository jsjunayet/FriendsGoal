"use client";

import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { MemberDirectorySection } from "@/components/sections/MemberDirectorySection";
import { useTranslation } from "@/context/LanguageContext";

export function MembersPageClient() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("members_page_crumb") },
        ]}
        titleLine1={t("members_page_title")}
        description={t("members_page_desc")}
      >
        <div className="inline-flex items-center gap-3.5 bg-white/80 backdrop-blur-sm border border-[#E5E5E5] rounded-full px-4 py-2 shadow-xs">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {["/images/about/about-2.svg", "/images/hero/hero-1.png", "/images/hero/hero-3.png"].map((src) => (
              <div key={src} className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white bg-gray-200">
                <Image src={src} alt="Member Avatar" fill className="object-cover" />
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-[#1FDE64] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center border-2 border-white">
              +100
            </div>
          </div>
          <span className="text-[13px] font-semibold text-[#1A1A1A]">
            Join 1,200+ active contributors
          </span>
        </div>
      </PageHero>
      <MemberDirectorySection />
    </div>
  );
}
