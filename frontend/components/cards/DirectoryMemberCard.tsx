"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Calendar, Droplets } from "lucide-react";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

interface DirectoryMemberCardProps {
  member: DirectoryMember;
  index: number;
}

const ROLE_TRANSLATIONS: Record<string, { en: string; bn: string }> = {
  SECRETARY: { en: "SECRETARY", bn: "সচিব" },
  TREASURER: { en: "TREASURER", bn: "কোষাধ্যক্ষ" },
  PRESIDENT: { en: "PRESIDENT", bn: "সভাপতি" },
  "FINANCIAL AUDITOR": { en: "FINANCIAL AUDITOR", bn: "আর্থিক অডিটর" },
  MEMBER: { en: "MEMBER", bn: "সদস্য" },
  "EXECUTIVE MEMBER": { en: "EXECUTIVE MEMBER", bn: "নির্বাহী সদস্য" },
  "FINANCIAL MEMBER": { en: "FINANCIAL MEMBER", bn: "আর্থিক সদস্য" },
  "VICE PRESIDENT": { en: "VICE PRESIDENT", bn: "সহ-সভাপতি" },
  "GENERAL SECRETARY": { en: "GENERAL SECRETARY", bn: "সাধারণ সম্পাদক" },
  "ASSISTANT SECRETARY": { en: "ASSISTANT SECRETARY", bn: "সহকারী সম্পাদক" },
};

export function DirectoryMemberCard({ member, index }: DirectoryMemberCardProps) {
  const { lang } = useTranslation();
  const roleText = ROLE_TRANSLATIONS[member.role]?.[lang] || member.role;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      // ── Same card shell as TeamMemberCard: p-3 pb-0, no overflow-hidden ──
      className="bg-white rounded-[20px] border border-[#E8E8E8] flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 p-3"
    >
      {/* ── Portrait image with gap on all sides + rounded corners ── */}
      <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-[#F0F0F0] z-10">
        <Image
          src={member.image || "/images/about/about-2.svg"}
          alt={`${member.name} — ${member.role}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover object-top transition-transform duration-500 hover:scale-[1.04] rounded-[14px]"
        />
        {/* Member ID badge — front layer circle */}
        <div className="absolute bottom-3 right-3 z-20 bg-[#1FDE64] text-[#262626] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase">
          {member.memberId}
        </div>
      </div>

      {/* ── Info below image ── */}
      <div className="pt-3 pb-1 px-1 flex flex-col gap-2.5">
        {/* Name + Role — left aligned */}
        <div className="text-left">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#888888] uppercase">
            {roleText}
          </p>
          <h3 className="font-bold text-[#1A1A1A] text-[15px] tracking-[0.06em] uppercase leading-tight mt-0.5">
            {member.name}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#F0F0F0]" />

        {/* 2×2 details grid */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pb-2 text-[11.5px] text-[#555555]">
          <div className="flex items-center gap-1.5 min-w-0" title={member.location}>
            <MapPin className="w-3 h-3 text-[#1FDE64] flex-shrink-0" />
            <span className="truncate">{member.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3 h-3 text-[#1FDE64] flex-shrink-0" />
            <span className="truncate">{member.dob}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Droplets className="w-3 h-3 text-[#1FDE64] flex-shrink-0" />
            <span className="truncate">{member.bloodGroup}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
