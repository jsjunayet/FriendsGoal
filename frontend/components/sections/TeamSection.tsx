"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { useTranslation } from "@/context/LanguageContext";

const ALL_MEMBERS = [
  {
    id: "belal-1",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    image: "/images/hero/hero-1.png",
    social: {},
  },
  {
    id: "belal-2",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    image: "/images/hero/hero-3.png",
    social: {},
  },
  {
    id: "belal-3",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    image: "/images/about/about-1.png",
    social: {},
  },
  // পেজ ২ এর ডাটা দেখানোর জন্য অতিরিক্ত উদাহরণ
  {
    id: "belal-4",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    image: "/images/about/about-2-team.png",
    social: {},
  },
];

export function TeamSection() {
  const [activeDot, setActiveDot] = useState(0);
  const { t } = useTranslation();

  // প্রতি পেজে ৩ জন করে মেম্বার ফিল্টার করার লজিক
  const ITEMS_PER_PAGE = 3;
  const visibleMembers = ALL_MEMBERS.slice(
    activeDot * ITEMS_PER_PAGE,
    (activeDot + 1) * ITEMS_PER_PAGE
  );

  return (
    <section
      id="committee"
      className="w-full bg-[#FAFAFA] py-16 sm:py-24 lg:py-28 overflow-hidden"
      aria-label="Founding Members"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Tag */}
          <span className="text-[13px] font-bold tracking-[0.2em] text-[#666666] uppercase mb-3">
            {t("team_tag")}
          </span>

          {/* Serif Heading */}
          <h2 className="font-serif text-[34px] sm:text-[42px] font-bold text-[#262626] leading-tight">
            {t("team_heading")}
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-[#666666] text-[16px] max-w-[540px]">
            {t("team_subtitle")}
          </p>

          {/* Cards Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 min-h-[380px]">
            {visibleMembers.map((member, i) => (
              <TeamMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>

          {/* ── Carousel Pagination Dots (Matching Image Design) ── */}
          <div className="flex items-center gap-2 mt-10" aria-label="Pagination">
            {[0, 1].map((index) => {
              const isActive = activeDot === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveDot(index)}
                  aria-label={`Page ${index + 1}`}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`h-2.5 rounded-full transition-colors duration-200 ${isActive
                        ? "w-7 bg-[#2B5A27]" // Active pill shape (Deep Green)
                        : "w-2.5 bg-[#C9D1C8] hover:bg-[#A8B5A6]" // Inactive small circle
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}