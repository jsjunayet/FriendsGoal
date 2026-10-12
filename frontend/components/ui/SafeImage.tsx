"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { resolveImageUrl } from "@/lib/i18nHelpers";
import { AvatarFallback } from "./AvatarFallback";

export interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallbackName?: string;
  fallbackMemberId?: string;
  renderAvatarFallback?: boolean;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/friends_goal_placeholder.svg",
  fallbackName,
  fallbackMemberId,
  renderAvatarFallback = false,
  className = "",
  onError,
  priority,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const resolved = resolveImageUrl(src);

  // Reset error if src prop changes
  useEffect(() => {
    setError(false);
    setFallbackError(false);
  }, [src]);

  // If both original src and fallbackSrc failed, render pure inline vector fallback
  if (fallbackError) {
    return (
      <div className={`w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 select-none ${className}`}>
        <svg className="w-10 h-10 mb-1 text-emerald-600/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Friends Goal</span>
      </div>
    );
  }

  const hasValidSrc = Boolean(resolved && resolved.trim() && !error);

  if (!hasValidSrc) {
    if (renderAvatarFallback) {
      return (
        <AvatarFallback
          name={fallbackName || alt}
          memberId={fallbackMemberId}
          className={className}
        />
      );
    }

    return (
      <Image
        {...props}
        src={fallbackSrc}
        alt={alt}
        className={className}
        priority={priority}
        onError={() => setFallbackError(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      className={className}
      priority={priority}
      onError={(e) => {
        setError(true);
        if (onError) onError(e);
      }}
    />
  );
}
