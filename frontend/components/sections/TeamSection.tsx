"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeMemberCard } from "@/components/cards/HomeMemberCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/context/LanguageContext";
import { getPublicMembersApi, type CMSMemberItem } from "@/lib/cmsMemberApi";

export function TeamSection() {
  const [activeDot, setActiveDot] = useState(0);
  const { t } = useTranslation();
  const [members, setMembers] = useState<CMSMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMembersApi()
      .then((data) => {
        if (data) {
          setMembers(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(members.length / ITEMS_PER_PAGE));
  const visibleMembers = members.slice(
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

          {/* Cards Grid or Empty State */}
          {members.length > 0 ? (
            <>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 min-h-[380px]">
                {visibleMembers.map((member: any, i: number) => (
                  <HomeMemberCard key={member._id || member.id || i} member={member} index={i} />
                ))}
              </div>

              {/* Carousel Pagination Dots */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-10" aria-label="Pagination">
                  {Array.from({ length: totalPages }).map((_, index) => {
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
                          className={`h-2.5 rounded-full transition-colors duration-200 ${
                            isActive
                              ? "w-7 bg-[#2B5A27]"
                              : "w-2.5 bg-[#C9D1C8] hover:bg-[#A8B5A6]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="w-full mt-12">
              <EmptyState />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}