"use client";

import { PageHero } from "@/components/PageHero";
import { PolicyViewerSection } from "@/components/sections/PolicyViewerSection";
import { useTranslation } from "@/context/LanguageContext";

export function PolicyPageClient() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("policy_page_crumb") },
        ]}
        titleLine1={t("policy_page_title")}
        description={t("policy_page_desc")}
      />
      <PolicyViewerSection />
    </div>
  );
}
