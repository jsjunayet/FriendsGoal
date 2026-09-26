"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/constants/site";
import { useTranslation } from "@/context/LanguageContext";

// Routes where the Footer should be hidden
const HIDDEN_ON: RegExp[] = [
  /^\/login$/,
  /^\/dashboard/,
  /^\/admin/,
  /^\/notifications/,
];

// ─── Logo ──────────────────────────────────────────────────────────────────────
function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group w-fit">
      <div className="w-8 h-8 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0 group-hover:bg-[#18c957] transition-colors">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 2C9 2 4 5.5 4 10C4 12.76 6.24 15 9 15C11.76 15 14 12.76 14 10C14 5.5 9 2 9 2Z" fill="#262626" />
          <circle cx="9" cy="10" r="2.5" fill="#1FDE64" />
        </svg>
      </div>
      <span className="font-bold text-[#262626] text-[17px]">Friends Goal</span>
    </Link>
  );
}

// ─── Social icons ──────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="10 15 15 12 10 9 10 15" fill="white" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

// ─── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();

  if (HIDDEN_ON.some((pattern) => pattern.test(pathname))) return null;

  return (
    <footer className="w-full bg-[#FAFAFA] text-[#666666] border-t border-[#E5E5E5]" aria-label="Footer">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 pt-12 sm:pt-14 pb-6">

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 pb-10 border-b border-[#E5E5E5]">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-3">
            <FooterLogo />
            <p className="text-[13.5px] leading-relaxed text-[#666666] max-w-[240px]">
              {t("footer_brand_desc")}
            </p>
            {/* Social icons */}
        
          </div>

          {/* Col 2 — Organization */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#262626] uppercase mb-0.5">
              {t("footer_org_col")}
            </h3>
            <ul className="flex flex-col gap-3 text-[13.5px]">
              <li><Link href="/policy"  className="hover:text-[#262626] transition-colors">{t("footer_policy")}</Link></li>
              <li><Link href="/about"   className="hover:text-[#262626] transition-colors">{t("footer_about")}</Link></li>
              <li><Link href="/gallery" className="hover:text-[#262626] transition-colors">{t("footer_gallery")}</Link></li>
              <li><Link href="/notice"  className="hover:text-[#262626] transition-colors">{t("footer_notice")}</Link></li>
              <li><Link href="/faq"     className="hover:text-[#262626] transition-colors">{t("footer_faq")}</Link></li>
            </ul>
          </div>

          {/* Col 3 — Membership */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#262626] uppercase mb-0.5">
              {t("footer_membership_col")}
            </h3>
            <ul className="flex flex-col gap-3 text-[13.5px]">
              <li><Link href="/members"       className="hover:text-[#262626] transition-colors">{t("footer_members")}</Link></li>
              <li><Link href="/login"         className="hover:text-[#262626] transition-colors">{t("footer_member_portal")}</Link></li>
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="flex flex-col ">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#262626] uppercase">
              {t("footer_contact_col")}
            </h3>

            {/* Email */}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 text-[13.5px] hover:text-[#262626] transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-[#1FDE64] flex-shrink-0" />
              {SITE_CONFIG.email}
            </a>

            {/* Phone */}
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-2 text-[13.5px] hover:text-[#262626] transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 text-[#1FDE64] flex-shrink-0" />
              {SITE_CONFIG.phone}
            </a>

            {/* Social icons */}
            <div className="flex items-center gap-2 mb-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-7 h-7 rounded-full bg-[#EFEFEF] hover:bg-white hover:shadow-md text-[#555555] hover:text-[#1FDE64] flex items-center justify-center transition-all duration-200 border border-transparent hover:border-[#E5E5E5]"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Office address */}
            <div className="flex items-start gap-2 mt-0.5 p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-[12.5px] leading-snug">
              <MapPin className="w-3.5 h-3.5 text-[#1FDE64] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#262626] block text-[10.5px] tracking-wider uppercase mb-0.5">
                  {t("footer_office")}
                </span>
                <span className="text-[#666]">House 158/B, 5th Floor,<br />Moynarbagh, Uttara,<br />Dhaka‑1212</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#888888]">
          <p>{t("footer_copyright")}</p>

<p className="text-[#888888]">
  {t("footer_dev")}{" "}
  <Link
    href="https://turtlestudio-it.com"
     target="_blank"
  rel="noopener noreferrer"
    className="text-[#1FDE64] underline underline-offset-2 hover:opacity-80 transition"
  >
    Turtle Studio
  </Link>
</p>
        </div>
      </div>
    </footer>
  );
}
