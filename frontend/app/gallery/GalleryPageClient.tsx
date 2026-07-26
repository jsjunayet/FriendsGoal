"use client";

import { PageHero } from "@/components/PageHero";
import { GallerySection } from "@/components/sections/GallerySection";
import { useTranslation } from "@/context/LanguageContext";

export function GalleryPageClient() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("gallery_page_crumb") },
        ]}
        titleLine1={t("gallery_page_title")}
        description={t("gallery_page_desc")}
      />
      <GallerySection />
    </div>
  );
}
