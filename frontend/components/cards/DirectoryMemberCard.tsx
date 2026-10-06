"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Droplet, Cake, IdCard, User } from "lucide-react";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { getLocalizedText, hasValidImage } from "@/lib/i18nHelpers";
import type { CMSMemberItem } from "@/lib/cmsMemberApi";

interface DirectoryMemberCardProps {
  member: DirectoryMember | CMSMemberItem | any;
  index: number;
}

function formatDob(dateStr?: string): string {
  if (!dateStr || dateStr === "N/A") return "01 Dec 1993";
  if (dateStr.length < 4) return dateStr;

  if (/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate().toString().padStart(2, "0");
    const month = parsed.toLocaleString("en-US", { month: "short" });
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return dateStr;
}

function formatBloodGroup(bg?: string): string {
  if (!bg || bg === "N/A") return "O+ (Positive)";
  const trimmed = bg.trim();
  if (trimmed.includes("(")) return trimmed;
  if (trimmed.endsWith("+") || trimmed.includes("+")) return `${trimmed} (Positive)`;
  if (trimmed.endsWith("-") || trimmed.includes("-")) return `${trimmed} (Negative)`;
  return `${trimmed} (Positive)`;
}

function formatMemberId(rawId?: any, index?: number): string {
  if (!rawId) return `ID-${((index ?? 0) + 1).toString().padStart(3, "0")}`;
  const str = String(rawId).trim();
  if (str.startsWith("ID-") || str.startsWith("FG-")) return str;
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    return `ID-${num.toString().padStart(3, "0")}`;
  }
  return `ID-${str}`;
}

function formatLocation(member: any): string {
  if (typeof member.location === "string" && member.location.trim()) {
    return member.location.trim();
  }
  const parts = [member.thana, member.district].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (member.district) return member.district;
  if (member.presentAddress) return member.presentAddress;
  return "Rajapur, Patuakhali";
}

export function DirectoryMemberCard({ member, index }: DirectoryMemberCardProps) {
  const { lang } = useTranslation();

  const nameText =
    getLocalizedText(member.name, lang) ||
    member.fullName ||
    (typeof member.name === "string" ? member.name : "") ||
    "MD BELAL HOSSAIN";

  const roleText =
    getLocalizedText(member.roleTitle, lang) ||
    (lang === "bn" ? member.designationBn : member.designation) ||
    (lang === "bn" ? member.roleBn : member.role) ||
    member.designation ||
    member.role ||
    "SECRETARY";

  const memberIdText = formatMemberId(member.memberId || member.memberCode || member.id, index);
  const locationText = formatLocation(member);
  const bloodGroupText = formatBloodGroup(member.bloodGroup);
  const dobText = formatDob(member.dob || member.dateOfBirth || member.joiningDate);
  const photo = member.photoUrl || member.pictureUrl || member.image;

  const hasPhoto = hasValidImage(photo);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-[22px] border border-gray-200/80 p-3.5 flex flex-col shadow-xs hover:shadow-md transition-all duration-300 h-full justify-between"
    >
      {/* ── Portrait image with rounded corners ── */}
      <div className="relative w-full aspect-[4/4.8] rounded-[16px] overflow-hidden bg-gray-100 flex items-center justify-center">
        {hasPhoto ? (
          <Image
            src={photo}
            alt={`${nameText} — ${roleText}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
          />
        ) : (
          /* Fallback Avatar */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-emerald-50/60 via-slate-50 to-emerald-100/40">
            <div className="w-16 h-16 rounded-full bg-[#00B074]/15 border border-[#00B074]/30 text-[#00B074] flex items-center justify-center text-xl font-bold mb-2 shadow-xs">
              {nameText ? nameText.charAt(0).toUpperCase() : <User className="w-7 h-7 text-[#00B074]" />}
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest line-clamp-1">
              Friends Goal Member
            </p>
          </div>
        )}
      </div>

      {/* ── Member Info ── */}
      <div className="pt-3.5 px-0.5 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#4B5563] uppercase line-clamp-1">
            {roleText}
          </p>
          <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#1A1A1A] tracking-[0.01em] uppercase leading-tight mt-1 line-clamp-1">
            {nameText}
          </h3>
        </div>

        {/* ── Horizontal Divider ── */}
        <div className="h-px bg-gray-100 my-3" />

        {/* ── 2 Columns Info Grid ── */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11.5px] font-medium text-[#374151]">
          {/* Location */}
          <div className="flex items-center gap-1.5 min-w-0" title={locationText}>
            <MapPin className="w-3.5 h-3.5 text-[#00B074] flex-shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          {/* DOB / Date */}
          <div className="flex items-center gap-1.5 min-w-0" title={dobText}>
            <Cake className="w-3.5 h-3.5 text-[#00B074] flex-shrink-0" />
            <span className="truncate">{dobText}</span>
          </div>

          {/* Blood Group */}
          <div className="flex items-center gap-1.5 min-w-0" title={bloodGroupText}>
            <Droplet className="w-3.5 h-3.5 text-[#00B074] flex-shrink-0" />
            <span className="truncate">{bloodGroupText}</span>
          </div>

          {/* Member ID */}
          <div className="flex items-center gap-1.5 min-w-0" title={memberIdText}>
            <IdCard className="w-3.5 h-3.5 text-[#00B074] flex-shrink-0" />
            <span className="truncate">{memberIdText}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

