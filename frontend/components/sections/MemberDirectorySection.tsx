"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { DirectoryMemberCard } from "@/components/cards/DirectoryMemberCard";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

const DIRECTORY_MEMBERS: DirectoryMember[] = [
  {
    id: "m-1",
    memberId: "ID-001",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-2.png",
  },
  {
    id: "m-2",
    memberId: "ID-002",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-4.png",
  },
  {
    id: "m-3",
    memberId: "ID-003",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/about/about-1.png",
  },
  {
    id: "m-4",
    memberId: "ID-004",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/about/about-2-team.png",
  },
  {
    id: "m-5",
    memberId: "ID-005",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-5.png",
  },
  {
    id: "m-6",
    memberId: "ID-006",
    name: "MD BELAL HOSSAIN",
    role: "SECRETARY",
    location: "Rajapur, Patuakhali",
    dob: "01 Dec 1993",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-3.png",
  },
  {
    id: "m-7",
    memberId: "ID-007",
    name: "MD. AL AMIN",
    role: "PRESIDENT",
    location: "Uttara, Dhaka",
    dob: "14 Feb 1991",
    bloodGroup: "B+ (Positive)",
    image: "/images/hero/hero-1.png",
  },
  {
    id: "m-8",
    memberId: "ID-008",
    name: "MD. MIRAJUL ISLAM",
    role: "VICE PRESIDENT",
    location: "Mirpur, Dhaka",
    dob: "10 Aug 1992",
    bloodGroup: "A+ (Positive)",
    image: "/images/hero/hero-3.png",
  },
  {
    id: "m-9",
    memberId: "ID-009",
    name: "MD. FAZLE RABBI",
    role: "TREASURER",
    location: "Dhanmondi, Dhaka",
    dob: "25 May 1994",
    bloodGroup: "AB+ (Positive)",
    image: "/images/about/about-1.png",
  },
  {
    id: "m-10",
    memberId: "ID-010",
    name: "MD. RAKIBUL HASAN",
    role: "ASSISTANT SECRETARY",
    location: "Gulshan, Dhaka",
    dob: "18 Nov 1995",
    bloodGroup: "O+ (Positive)",
    image: "/images/hero/hero-1.png",
  },
  {
    id: "m-11",
    memberId: "ID-011",
    name: "MD. SHAHIN ALAM",
    role: "EXECUTIVE MEMBER",
    location: "Savar, Dhaka",
    dob: "05 Mar 1993",
    bloodGroup: "B+ (Positive)",
    image: "/images/hero/hero-5.png",
  },
  {
    id: "m-12",
    memberId: "ID-012",
    name: "MD. JEWEL HASAN",
    role: "GENERAL SECRETARY",
    location: "Gazipur, Dhaka",
    dob: "12 Jul 1990",
    bloodGroup: "O- (Negative)",
    image: "/images/hero/hero-2.png",
  },
];

export function MemberDirectorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return DIRECTORY_MEMBERS;
    const q = searchQuery.toLowerCase();
    return DIRECTORY_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Determine displayed members list
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
                <DirectoryMemberCard key={member.id} member={member} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-16 text-center text-[#666666]">
            No members found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

        {/* LOAD MORE / LOAD LESS Button */}
        {filteredMembers.length > 6 && (
          <div className="mt-12 flex items-center justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll((v) => !v)}
              className="
                inline-flex items-center justify-center gap-2
                h-[46px] px-8 rounded-full
                bg-white border border-[#E5E5E5] text-[#1A1A1A]
                text-[13px] font-bold tracking-wider uppercase
                hover:bg-[#FAFAFA] transition-all duration-200
                cursor-pointer shadow-xs
              "
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
