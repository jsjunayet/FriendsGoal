"use client";

import { PageHero } from "@/components/PageHero";
import { NoticeFeed } from "@/components/sections/NoticeFeed";
import { useTranslation } from "@/context/LanguageContext";

export function NoticePageClient() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("notice_page_crumb") },
        ]}
        titleLine1={t("notice_page_title")}
        description={t("notice_page_desc")}
      />
      <NoticeFeed />
    </div>
  );
}
