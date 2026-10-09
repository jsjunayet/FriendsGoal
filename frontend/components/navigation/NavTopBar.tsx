"use client";

import { useEffect, useState } from "react";
import { Phone, Bell } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { useTranslation } from "@/context/LanguageContext";
import { getTickerNoticesApi, getNoticesApi, type NoticeItem } from "@/lib/noticeApi";
import { getMarqueeItemsApi, type MarqueeItem } from "@/lib/marqueeApi";
import { getLocalizedText } from "@/lib/i18nHelpers";
import Link from "next/link";

const SOCIALS = [
  { key: "fb", label: "Facebook", icon: "f" },
  { key: "li", label: "LinkedIn", icon: "in" },
  { key: "tw", label: "X (Twitter)", icon: "𝕏" },
] as const;

export function NavTopBar() {
  const { lang } = useTranslation();
  const isBn = lang === "bn";
  const [marqueeItems, setMarqueeItems] = useState<Array<{ text: string; link?: string }>>([]);

  useEffect(() => {
    // 1. First try fetching dedicated Marquee items from CMS backend
    getMarqueeItemsApi(true)
      .then((data) => {
        if (data && data.length > 0) {
          setMarqueeItems(
            data.map((m) => ({
              text: getLocalizedText(m.text, lang),
              link: m.link,
            }))
          );
        } else {
          // 2. Fallback to Notice Tickers
          getTickerNoticesApi()
            .then((noticeData) => {
              if (noticeData && noticeData.length > 0) {
                setMarqueeItems(
                  noticeData.map((n) => ({
                    text: getLocalizedText(n.title, lang),
                    link: `/notice/${n.slug || n._id}`,
                  }))
                );
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [lang]);

  const defaultTickerList = [
    {
      text: isBn
        ? `${SITE_CONFIG.nameBn} — ${SITE_CONFIG.tagline}`
        : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
      link: "/",
    },
  ];

  const itemsToDisplay = marqueeItems.length > 0 ? marqueeItems : defaultTickerList;

  // Duplicate list to create a seamless infinite scrolling marquee loop
  const duplicatedItems =
    itemsToDisplay.length > 0
      ? [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay]
      : [];


  return (
    <div className="bg-[#F8FAF5] text-[#262626] text-[12px] border-b border-[#E3EBDC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 h-9 flex items-center justify-between gap-4 overflow-hidden">
        {/* Left: Ticker Marquee matching reference image */}
        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-[#2D5A27] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex-shrink-0 shadow-2xs">
            <Bell className="w-3 h-3 text-[#10B981] animate-pulse" />
            {isBn ? "নোটিশ" : "NOTICE"}
          </span>

          {/* Marquee Banner Container */}
          <div className="flex-1 overflow-hidden relative h-6 flex items-center">
            <div className="animate-marquee-slow flex items-center whitespace-nowrap">
              {duplicatedItems.map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-4 shrink-0 pr-6">
                  <Link
                    href={item.link || "#"}
                    className="text-xs font-semibold text-[#1A1A1A] hover:text-[#2D5A27] hover:underline transition-colors leading-none flex items-center"
                  >
                    {item.text}
                  </Link>
                  {/* Perfectly Centered Bullet Separator */}
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 inline-block" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: phone + socials */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="flex items-center gap-1.5 text-[#262626]/80 hover:text-[#2D5A27] transition-colors font-medium text-[11.5px]"
          >
            <Phone className="w-3 h-3 flex-shrink-0 text-[#2D5A27]" />
            {SITE_CONFIG.phone}
          </a>
          <span className="w-px h-3.5 bg-gray-300" aria-hidden="true" />
          <div className="flex items-center gap-[10px]">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href="#"
                aria-label={s.label}
                className="w-5 h-5 bg-[#2D5A27]/10 text-[#2D5A27] rounded-full flex items-center justify-center hover:bg-[#2D5A27] hover:text-white transition-colors text-[9px] font-bold leading-none"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

