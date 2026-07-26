"use client";

import { PageHero } from "@/components/PageHero";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { useTranslation } from "@/context/LanguageContext";

export function AboutPageClient() {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white text-[#555555]">
      <PageHero
        breadcrumbs={[
          { label: t("home"), href: "/" },
          { label: t("about_page_crumb") },
        ]}
        titleLine1={t("about_page_title1")}
        titleLine2={t("about_page_title2")}
        description={t("about_page_desc")}
      />
      <PhilosophySection />
      <VisionMissionSection />
      <ContactSection />
    </div>
  );
}
