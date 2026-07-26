import type { Metadata } from "next";
import { getSiteMetadata } from "@/lib/metadata";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { GallerySection } from "@/components/sections/GallerySection";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("home");
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VisionMissionSection />
      <StatsSection />
      <TeamSection />
      <NewsSection />
      <GallerySection />
    </>
  );
}
