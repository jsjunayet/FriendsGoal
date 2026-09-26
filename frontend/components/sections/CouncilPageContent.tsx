"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { DirectoryMemberCard } from "@/components/cards/DirectoryMemberCard";
import type { DirectoryMember } from "@/types";
import { useTranslation } from "@/context/LanguageContext";

export interface CouncilResponsibility {
  num: string;
  title: string;
  titleBn?: string;
  text: string;
  textBn?: string;
}

export interface RoleOption {
  label: string;       // English label
  labelBn: string;     // Bangla label
}

export interface CouncilPageContentProps {
  headingTitle: string;
  headingTitleBn?: string;
  /** All available role pills shown above the member grid */
  roleOptions: RoleOption[];
  /** Default selected role (English label) */
  defaultRole: string;
  members: DirectoryMember[];
  roleDescription: string;
  roleDescriptionBn?: string;
  responsibilities: CouncilResponsibility[];
}

export function CouncilPageContent({
  headingTitle,
  headingTitleBn = "",
  roleOptions = [],
  defaultRole = "",
  members,
  roleDescription,
  roleDescriptionBn = "",
  responsibilities,
}: CouncilPageContentProps) {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  const displayHeading = isBn && headingTitleBn ? headingTitleBn : headingTitle;
  const displayRoleDesc = isBn && roleDescriptionBn ? roleDescriptionBn : roleDescription;
  const responsibilitiesLabel = isBn ? "দায়িত্বসমূহ" : "Responsibilities";

  const [selectedRole, setSelectedRole] = useState<string>(defaultRole);

  // Reset to defaultRole whenever language or defaultRole changes
  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  // Find selected role option for description & filtering
  const selectedOption = roleOptions.find((r) => r.label === selectedRole);
  const displaySelectedLabel = isBn && selectedOption?.labelBn
    ? selectedOption.labelBn
    : selectedOption?.label ?? selectedRole;

  // Filter members by selected role (match against English label or Bangla label)
  const filteredMembers = members.filter((m) => {
    const roleEn = m.role?.toLowerCase() || "";
    const roleBn = (m as any).roleBn || (m as any).designationBn || "";
    const target = selectedRole.toLowerCase();
    const optionMatches =
      selectedOption &&
      (m.role === selectedOption.label ||
        roleBn === selectedOption.labelBn ||
        m.role === selectedOption.labelBn);
    return (
      roleEn === target ||
      roleBn === selectedRole ||
      m.role === selectedRole ||
      optionMatches
    );
  });
  // If no members match the filter, show all
  const displayMembers = filteredMembers.length > 0 ? filteredMembers : members;

  return (
    <section className="w-full py-14 sm:py-20 bg-white" aria-label={headingTitle}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 space-y-10">

        {/* ── Section heading ──────────────────────────────────────────── */}
        <h2 className="font-serif text-[28px] sm:text-[32px] font-bold text-[#1A1A1A] tracking-tight">
          {displayHeading}
        </h2>

        {/* ── Role filter pills ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2.5">
          {roleOptions.map((role) => {
            const isActive = selectedRole === role.label;
            const roleLabel = isBn ? role.labelBn : role.label;
            return (
              <button
                key={role.label}
                type="button"
                onClick={() => setSelectedRole(role.label)}
                className={`
                  h-[38px] px-5 rounded-full text-[13px] font-semibold
                  border transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${isActive
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm"
                    : "bg-white text-[#333333] border-[#D5D5D5] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }
                `}
              >
                {roleLabel}
              </button>
            );
          })}
        </div>

        {/* ── Section subheading under pills ───────────────────────────── */}
        <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1A1A1A] -mt-2">
          {displayHeading}
        </h3>

        {/* ── Member cards grid ─────────────────────────────────────────── */}
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {displayMembers.map((member, index) => (
            <DirectoryMemberCard key={member.id + index} member={member} index={index} />
          ))}
        </motion.div>

        {/* ── Role description + responsibilities ───────────────────────── */}
        <div className="pt-4 space-y-6 max-w-[920px]">
          <div>
            <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1A1A1A]">
              {displaySelectedLabel}
            </h3>
            <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
              {displayRoleDesc}
            </p>
          </div>

          {/* Responsibilities badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-serif text-[20px] font-bold text-[#2B5A27]">
              {responsibilitiesLabel}
            </h4>
          </div>

          {/* Responsibility cards */}
          <div className="space-y-5">
            {responsibilities.map((item) => {
              const itemTitle = isBn && item.titleBn ? item.titleBn : item.title;
              const itemText = isBn && item.textBn ? item.textBn : item.text;
              return (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[24px] border border-[#E5E5E5] p-6 sm:p-8 shadow-xs space-y-3"
                >
                  <h5 className="font-bold text-[16px] sm:text-[17px] text-[#1A1A1A] leading-snug">
                    {item.num}. {itemTitle}
                  </h5>
                  <p className="text-[14px] text-[#555555] leading-relaxed pl-5 relative before:absolute before:left-1.5 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#1FDE64]">
                    {itemText}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
