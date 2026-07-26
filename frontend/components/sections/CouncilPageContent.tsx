"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ChevronDown } from "lucide-react";
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

export interface CouncilPageContentProps {
  headingTitle: string;
  headingTitleBn?: string;
  roleFilterLabel: string;
  roleFilterLabelBn?: string;
  members: DirectoryMember[];
  roleDescription: string;
  roleDescriptionBn?: string;
  responsibilities: CouncilResponsibility[];
}

export function CouncilPageContent({
  headingTitle = "Core Leadership",
  headingTitleBn = "মূল নেতৃত্ব",
  roleFilterLabel = "Executive Member",
  roleFilterLabelBn = "নির্বাহী সদস্য",
  members,
  roleDescription,
  roleDescriptionBn = "নির্বাহী সদস্যদের মূল দায়িত্ব হলো সংগঠনের মসৃণ কার্যক্রম পরিচালনা নিশ্চিত করা এবং লক্ষ্য অর্জনে সহায়তা করা।",
  responsibilities,
}: CouncilPageContentProps) {
  const { lang } = useTranslation();
  const isBn = lang === "bn";

  const displayHeading = isBn ? headingTitleBn : headingTitle;
  const displayRoleFilter = isBn ? roleFilterLabelBn : roleFilterLabel;
  const displayRoleDesc = isBn && roleDescriptionBn ? roleDescriptionBn : roleDescription;
  const responsibilitiesLabel = isBn ? "দায়িত্বসমূহ-" : "Responsibilities-";

  const [selectedRole, setSelectedRole] = useState<string>(displayRoleFilter);

  return (
    <section className="w-full py-14 sm:py-20 bg-white" aria-label={headingTitle}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 space-y-12">
        {/* Top Header Row with Role Filter Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-[32px] sm:text-[36px] font-bold text-[#1A1A1A] tracking-tight">
            {displayHeading}
          </h2>

          {/* Filter Dropdown Pill */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-3
                h-[44px] px-6 rounded-full
                bg-white border border-[#E5E5E5] text-[#1A1A1A]
                text-[14px] font-semibold tracking-tight
                hover:bg-[#FAFAFA] transition-colors duration-200
                shadow-xs cursor-pointer
              "
            >
              <span>{selectedRole || displayRoleFilter}</span>
              <ChevronDown className="w-4 h-4 text-[#555555]" />
            </button>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {members.map((member, index) => (
            <DirectoryMemberCard key={member.id + index} member={member} index={index} />
          ))}
        </div>

        {/* Responsibilities Section Below Grid */}
        <div className="pt-8 space-y-6 max-w-[920px]">
          <div>
            <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#1A1A1A]">
              {displayRoleFilter}
            </h3>
            <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
              {displayRoleDesc}
            </p>
          </div>

          {/* Responsibilities Green Badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-[#1FDE64] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Users className="w-4.5 h-4.5 text-white" />
            </div>
            <h4 className="font-serif text-[20px] font-bold text-[#2B5A27]">
              {responsibilitiesLabel}
            </h4>
          </div>

          {/* Responsibilities Policy Box */}
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
