"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants/site";
import { useTranslation } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

import { NavLogo } from "@/components/navigation/NavLogo";
import { NavTopBar } from "@/components/navigation/NavTopBar";
import { DesktopNavItem } from "@/components/navigation/NavDesktopItem";
import { NavMobileMenu } from "@/components/navigation/NavMobileMenu";
import { getNavActive } from "@/components/navigation/navUtils";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrolled(threshold = 72) {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return scrolled;
}

function useActiveSectionOnHome(pathname: string) {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["home", "about", "committee", "policy", "team", "news", "gallery", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { threshold: 0.25, rootMargin: "-64px 0px -30% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return activeSection;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const scrolled = useScrolled();
  const activeSection = useActiveSectionOnHome(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "top-0 left-0 z-50 w-full transition-all duration-300",
          // At the top: sits in normal flow overlaying the hero
          // Once scrolled: becomes fixed and slides in from above
          scrolled ? "fixed" : "absolute"
        )}
      >
        <motion.div
          className={cn(
            "w-full transition-colors duration-300",
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100"
              : "bg-transparent"
          )}
          initial={false}
          animate={scrolled ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8 h-[64px] sm:h-[72px] flex items-center justify-between gap-4">
            <NavLogo />

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <DesktopNavItem
                  key={item.href + item.label}
                  item={item}
                  isActive={getNavActive(item, pathname, activeSection)}
                />
              ))}
            </nav>

            {/* Language toggle + Login CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <LanguageToggle variant="pill" />
              <Link
                href="/login"
                className="
                  inline-flex items-center justify-center
                  h-[40px] px-6 rounded-full
                  bg-[#262626] text-white
                  text-[15px] font-semibold tracking-tight
                  hover:bg-[#1a1a1a] transition-all duration-200 shadow-sm
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#262626]
                "
              >
                {t("nav_login")}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <NavMobileMenu
            activeSection={activeSection}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
