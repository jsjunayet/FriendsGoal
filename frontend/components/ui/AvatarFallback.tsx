"use client";

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface AvatarFallbackProps {
  name?: string | null;
  memberId?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  usePlaceholderImage?: boolean;
}

const sizeClasses: Record<string, { container: string; text: string; icon: string; px: number }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", icon: "w-3 h-3", px: 24 },
  sm: { container: "w-8 h-8", text: "text-xs", icon: "w-4 h-4", px: 32 },
  md: { container: "w-10 h-10", text: "text-sm", icon: "w-5 h-5", px: 40 },
  lg: { container: "w-16 h-16", text: "text-lg", icon: "w-7 h-7", px: 64 },
  xl: { container: "w-24 h-24", text: "text-2xl", icon: "w-10 h-10", px: 96 },
};

export function AvatarFallback({
  name,
  memberId,
  size = "md",
  className = "",
  usePlaceholderImage = false,
}: AvatarFallbackProps) {
  const sizeConfig =
    typeof size === "string" ? sizeClasses[size] || sizeClasses.md : {
      container: `w-[${size}px] h-[${size}px]`,
      text: "text-sm",
      icon: "w-5 h-5",
      px: size,
    };

  const getInitials = (): string => {
    if (memberId && memberId.trim()) {
      const cleanId = memberId.replace(/^FG-?/i, "").trim();
      if (cleanId) return cleanId.slice(0, 3).toUpperCase();
    }
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "";
  };

  const initials = getInitials();

  if (usePlaceholderImage) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center bg-[#E8F8F5] border border-[#00B074]/20 shadow-xs flex-shrink-0 ${
          typeof size === "string" ? sizeConfig.container : ""
        } ${className}`}
        style={typeof size === "number" ? { width: size, height: size } : undefined}
      >
        <Image
          src="/friends_goal_placeholder.svg"
          alt={name || "Member Avatar"}
          width={sizeConfig.px}
          height={sizeConfig.px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold font-sans select-none flex-shrink-0 shadow-xs
        bg-gradient-to-br from-[#00B074] to-[#028659] text-white border border-emerald-400/30
        ${typeof size === "string" ? sizeConfig.container : ""} ${className}`}
      style={typeof size === "number" ? { width: size, height: size } : undefined}
      title={name || memberId || "Member"}
    >
      {initials ? (
        <span className={sizeConfig.text}>{initials}</span>
      ) : (
        <User className={sizeConfig.icon} />
      )}
    </div>
  );
}
