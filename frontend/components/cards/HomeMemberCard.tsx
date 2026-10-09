"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { getLocalizedText, hasValidImage } from "@/lib/i18nHelpers";
import type { CMSMemberItem } from "@/lib/cmsMemberApi";

interface HomeMemberCardProps {
  member: CMSMemberItem | any;
  index: number;
}

export function HomeMemberCard({ member, index }: HomeMemberCardProps) {
  const { lang } = useTranslation();

  const nameText =
    getLocalizedText(member.name, lang) ||
    member.fullName ||
    (typeof member.name === "string" ? member.name : "") ||
    "Member";

  const designationText =
    getLocalizedText(member.roleTitle, lang) ||
    (lang === "bn" ? member.designationBn : member.designation) ||
    (lang === "bn" ? member.roleBn : member.role) ||
    member.designation ||
    "";

  const photo = member.photoUrl || member.pictureUrl || member.image;
  const hasPhoto = hasValidImage(photo);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-[32px] border border-[#DCDCDC] p-3 flex flex-col shadow-xs hover:shadow-xl transition-all duration-300 h-full justify-between"
    >
      {/* ── Inner Photo Box with Rounded Corners ── */}
      <div className="relative w-full aspect-[3/4] rounded-t-[22px] overflow-hidden bg-[#222222] z-10 flex items-center justify-center">
        {hasPhoto ? (
          <Image
            src={photo}
            alt={`${nameText} — ${designationText}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
          />
        ) : (
          /* Fallback Avatar */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#2D2D2D] via-[#1A1A1A] to-[#121212] text-white">
            <div className="w-20 h-20 rounded-full bg-[#00B074]/20 border-2 border-[#00B074]/40 text-[#00B074] flex items-center justify-center text-2xl font-bold mb-2 shadow-xs">
              {nameText ? nameText.charAt(0).toUpperCase() : <User className="w-8 h-8 text-[#00B074]" />}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">
              Friends Goal Member
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom Text Section (Centered Name + Designation) ── */}
      <div className="pt-5 pb-5 px-3 text-center flex flex-col items-center justify-center">
        <h3 className="font-serif text-[19px] sm:text-[21px] font-bold text-[#1F1F1F] tracking-[0.03em] uppercase leading-tight line-clamp-1">
          {nameText}
        </h3>
        <p className="text-[11.5px] font-bold text-[#3A3A3A] tracking-[0.18em] uppercase mt-2.5 line-clamp-1">
          {designationText}
        </p>
      </div>
    </motion.article>
  );
}
