import { cookies } from "next/headers";
import type { Metadata } from "next";

// ─── Language detection ───────────────────────────────────────────────────────

async function getLang(): Promise<"en" | "bn"> {
  const store = await cookies();
  const val = store.get("fg_lang")?.value;
  return val === "en" ? "en" : "bn"; // default bn
}

// ─── Per-page bilingual metadata map ─────────────────────────────────────────

interface PageMeta {
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: {
      en: "Friends Goal — Let's Go Together, Inshallah.",
      bn: "ফ্রেন্ডস গোল — চলো একসাথে, ইনশাআল্লাহ।",
    },
    description: {
      en: "A community built on trust, mutual support, and interest-free financial growth.",
      bn: "বিশ্বাস, পারস্পরিক সহযোগিতা ও সুদমুক্ত আর্থিক প্রবৃদ্ধির উপর গড়ে ওঠা একটি সম্প্রদায়।",
    },
  },
  about: {
    title: {
      en: "About Us | Friends Goal",
      bn: "আমাদের সম্পর্কে | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Learn about Friends Goal — our mission, vision, and the values that drive our interest-free community savings organization.",
      bn: "ফ্রেন্ডস গোল সম্পর্কে জানুন — আমাদের লক্ষ্য, দৃষ্টিভঙ্গি এবং সুদমুক্ত সঞ্চয় সংগঠনের মূল্যবোধ।",
    },
  },
  gallery: {
    title: {
      en: "Gallery | Friends Goal",
      bn: "গ্যালারি | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Browse photos and moments from Friends Goal community events, meetings, and milestones.",
      bn: "ফ্রেন্ডস গোলের সম্প্রদায়িক অনুষ্ঠান, সভা ও মাইলফলকের ছবি দেখুন।",
    },
  },
  members: {
    title: {
      en: "Members | Friends Goal",
      bn: "সদস্যবৃন্দ | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Browse the full directory of Friends Goal members — active contributors building self-reliant lives together.",
      bn: "ফ্রেন্ডস গোলের সকল সদস্যের তালিকা দেখুন — যারা একসাথে স্বনির্ভর জীবন গড়ছেন।",
    },
  },
  notice: {
    title: {
      en: "Notice | Friends Goal",
      bn: "নোটিশ | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Official notices, announcements, and updates from Friends Goal.",
      bn: "ফ্রেন্ডস গোলের আনুষ্ঠানিক নোটিশ, ঘোষণা ও আপডেট।",
    },
  },
  faq: {
    title: {
      en: "FAQ | Friends Goal",
      bn: "সাধারণ প্রশ্ন | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Everything you need to know about Friends Goal — membership, savings, Shariah compliance, and more.",
      bn: "ফ্রেন্ডস গোল সম্পর্কে সকল প্রশ্নের উত্তর — সদস্যপদ, সঞ্চয়, শরিয়াহ সম্মতি এবং আরও অনেক কিছু।",
    },
  },
  policy: {
    title: {
      en: "Policy | Friends Goal",
      bn: "নীতিমালা | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Read the full structure, rules, and governance policy of Friends Goal.",
      bn: "ফ্রেন্ডস গোলের সম্পূর্ণ কাঠামো, নিয়মাবলী ও পরিচালনা নীতি পড়ুন।",
    },
  },
  executive: {
    title: {
      en: "Executive Council | Friends Goal",
      bn: "নির্বাহী পরিষদ | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Meet the elected executive leadership of Friends Goal — driving collective governance and visionary decision-making.",
      bn: "ফ্রেন্ডস গোলের নির্বাচিত নির্বাহী নেতৃত্বের সাথে পরিচিত হন — যারা সমষ্টিগত সুশাসন পরিচালনা করছেন।",
    },
  },
  financial: {
    title: {
      en: "Financial Council | Friends Goal",
      bn: "আর্থিক পরিষদ | ফ্রেন্ডস গোল",
    },
    description: {
      en: "Meet the financial oversight council of Friends Goal — ensuring transparent, interest-free treasury management.",
      bn: "ফ্রেন্ডস গোলের আর্থিক তদারকি পরিষদের সাথে পরিচিত হন — স্বচ্ছ ও সুদমুক্ত কোষাগার ব্যবস্থাপনা নিশ্চিতকারী।",
    },
  },
};

// ─── Public helper ────────────────────────────────────────────────────────────

export async function getSiteMetadata(page: keyof typeof PAGE_META): Promise<Metadata> {
  const lang = await getLang();
  const meta = PAGE_META[page];

  return {
    title: meta.title[lang],
    description: meta.description[lang],
    openGraph: {
      title: meta.title[lang],
      description: meta.description[lang],
      locale: lang === "bn" ? "bn_BD" : "en_US",
      type: "website",
    },
  };
}
