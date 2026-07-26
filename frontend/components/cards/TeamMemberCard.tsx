"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TeamMember } from "@/types";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-[20px] border border-[#E8E8E8] flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 p-3 pb-4"
    >
      {/* ── Image with gap on all sides (mounted inside the card) ── */}
      <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-[#F0F0F0]">
        <Image
          src={member.image}
          alt={`${member.name} — ${member.role}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover object-top transition-transform duration-700 hover:scale-[1.04] rounded-[14px]"
        />
      </div>

      {/* ── Info below image ── */}
      <div className="pt-3.5 text-center flex flex-col items-center gap-1">
        <h3 className="font-bold text-[#1A1A1A] text-[15px] tracking-[0.06em] uppercase leading-tight">
          {member.name}
        </h3>
        <p className="text-[11px] font-bold text-[#888888] uppercase tracking-[0.18em]">
          {member.role}
        </p>
      </div>
    </motion.article>
  );
}
