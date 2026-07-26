"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Lang, type TranslationKey } from "@/lib/translations";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "fg_lang";

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Set default language to Bangla ("bn")
  const [lang, setLangState] = useState<Lang>("bn");

  // Hydrate from localStorage on mount (if user previously picked a preference)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      const resolved: Lang = (stored === "en" || stored === "bn") ? stored : "bn";
      setLangState(resolved);
      // Keep cookie in sync so server metadata can read it
      document.cookie = `fg_lang=${resolved};path=/;max-age=31536000;samesite=lax`;
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      // Also write as a cookie so server components (metadata) can read it
      document.cookie = `fg_lang=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = translations[lang] || translations.bn;
      return dict[key] || translations.en[key] || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LanguageProvider>");
  }
  return ctx;
}
