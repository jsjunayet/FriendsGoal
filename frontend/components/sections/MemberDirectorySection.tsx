"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { DirectoryMemberCard } from "@/components/cards/DirectoryMemberCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/context/LanguageContext";
import { getPublicMembersApi, type CMSMemberItem } from "@/lib/cmsMemberApi";
import { getLocalizedText } from "@/lib/i18nHelpers";

export function MemberDirectorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { lang, t } = useTranslation();
  const [apiMembers, setApiMembers] = useState<CMSMemberItem[]>([]);

  useEffect(() => {
    getPublicMembersApi()
      .then((data) => {
        if (data && data.length > 0) setApiMembers(data);
      })
      .catch(() => {});
  }, []);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return apiMembers;
    const q = searchQuery.toLowerCase();
    return apiMembers.filter((m) => {
      const name = getLocalizedText(m.name, lang, m.fullName || "").toLowerCase();
      const role = getLocalizedText(m.roleTitle, lang, m.designation || "").toLowerCase();
      const loc = (m.district || "").toLowerCase();
      const id = (m.memberId || m.memberCode || "").toLowerCase();
      return name.includes(q) || role.includes(q) || loc.includes(q) || id.includes(q);
    });
  }, [searchQuery, apiMembers, lang]);

  const visibleMembers = showAll ? filteredMembers : filteredMembers.slice(0, 6);

  return (
    <section className="w-full py-16 sm:py-24 bg-white" aria-label="Member Directory">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col items-start max-w-[620px]">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#2B5A27] uppercase mb-2 block">
              {t("members_page_crumb")}
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#1A1A1A] leading-tight">
              {t("members_page_title")}
            </h2>
            <p className="mt-3 text-[#555555] text-[15px] sm:text-[16px] leading-relaxed">
              {t("members_page_desc")}
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-[320px] flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input
              type="text"
              placeholder={t("search_dir")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAll(true);
              }}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#1FDE64] focus:bg-white rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition-all"
            />
          </div>
        </div>

        {/* Member Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {visibleMembers.map((member, i) => (
                <DirectoryMemberCard key={member._id || i} member={member} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? `No members found matching "${searchQuery}"` : undefined}
            titleBn={searchQuery ? `"${searchQuery}" এর সাথে মিলে এমন কোনো সদস্য পাওয়া যায়নি` : undefined}
          />
        )}

        {/* LOAD MORE / LOAD LESS Button */}
        {filteredMembers.length > 6 && (
          <div className="mt-12 flex items-center justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center justify-center gap-2 h-[46px] px-8 rounded-full bg-white border border-[#E5E5E5] text-[#1A1A1A] text-[13px] font-bold tracking-wider uppercase hover:bg-[#FAFAFA] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <span>{showAll ? t("load_less") : t("load_more")}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 text-[#1A1A1A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#1A1A1A]" />
              )}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
