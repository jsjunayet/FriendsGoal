"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useState } from "react";
import { getLocalizedText, hasValidImage, resolveImageUrl } from "@/lib/i18nHelpers";
import type { CMSMemberItem } from "@/lib/cmsMemberApi";

interface HomeMemberCardProps {
  member: CMSMemberItem | any;
  index: number;
}

export function HomeMemberCard({ member, index }: HomeMemberCardProps) {
  const { lang } = useTranslation();
  const [imgError, setImgError] = useState(false);

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

  const rawPhoto = member.photoUrl || member.pictureUrl || member.image;
  const photo = resolveImageUrl(rawPhoto);
  const hasPhoto = hasValidImage(photo) && !imgError;

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
      <div className="relative w-full aspect-[3/4] rounded-t-[22px] overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 z-10 flex items-center justify-center">
        {hasPhoto ? (
          <Image
            src={photo}
            alt={`${nameText} — ${designationText}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback Avatar */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#1C281D] via-[#141E15] to-[#0D140E] text-white">
            <div className="w-20 h-20 rounded-full bg-[#00B074]/20 border-2 border-[#00B074]/50 text-[#00B074] flex items-center justify-center text-3xl font-serif font-bold mb-3 shadow-md">
              {nameText ? nameText.trim().charAt(0).toUpperCase() : <User className="w-9 h-9 text-[#00B074]" />}
            </div>
            <p className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest line-clamp-1">
              Friends Goal
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              General Member
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
