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
        <div className="inline-flex items-center gap-3.5  rounded-full px-4 py-2 ">
          <div className="flex items-center -space-x-2.5">
            {[
              { src: "/images/hero/hero-1-team.png", alt: "Member 1" },
              { src: "/images/about/about-2-team.png", alt: "Member 2" },
              { src: "/images/hero/hero-2.png", alt: "Member 3" },
            ].map((avatar) => (
              <div key={avatar.src} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-gray-200 flex-shrink-0">
                <Image src={avatar.src} alt={avatar.alt} fill className="object-cover object-top" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-[#1FDE64] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white flex-shrink-0">
              +100
            </div>
          </div>
          <span className="text-[13px] font-semibold text-[#555555]">
            Join 1,200+ active contributors
          </span>
        </div>
      </PageHero>
      <MemberDirectorySection />
    </div>
  );
}
