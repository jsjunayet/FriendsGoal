import type {
  NavItem,
  StatItem,
  FeatureItem,
  FinancialCard,
  SavingsBreakdownRow,
  TeamMember,
  NewsArticle,
  FooterColumn,
} from "@/types";

// ─── Site Config ───────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Friends Goal",
  nameBn: "ফ্রেন্ডস গোল",
  tagline: "Let's Go Together, Inshallah.",
  description:
    "A community built on trust, mutual support, and interest-free financial growth.",
  address: "House 158/B (5th Floor), Moynarbagh, Uttara, Dhaka-1212",
  email: "admin@friendsgoal.org",
  phone: "+880-1774-987030",
  established: "2024",
} as const;

// ─── Navigation ────────────────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Policy", href: "/policy" },
  {
    label: "Council's",
    href: "/council/executive",
    dropdown: [
      {
        label: "Executive Council",
        href: "/council/executive",
        description: "Board members & elected leadership",
      },
      {
        label: "Financial Council",
        href: "/council/financial",
        description: "Savings, investment & treasury oversight",
      },
    ],
  },
  { label: "Members", href: "/members" },
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notice", href: "/notice" },
  { label: "FAQ", href: "/faq" },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────
export const STATS: StatItem[] = [
  { value: 111, suffix: "+", label: "Active Members" },
  { value: 70, suffix: "+", label: "Regular Contributors" },
  { value: 655000, suffix: "+", label: "Total Savings(BDT)" },
  { value: 2050000, suffix: "+", label: "Total Investment" },
];

// ─── About Features ────────────────────────────────────────────────────────────
export const ABOUT_FEATURES: FeatureItem[] = [
  { text: "Nationwide operational coverage across Bangladesh" },
  { text: "Democratic board structure with elected representatives" },
  { text: "Fully transparent financial reporting every month" },
  { text: "Islamic principles — 100% interest-free operations" },
];

// ─── Financial Plan Cards ──────────────────────────────────────────────────────
export const FINANCIAL_CARDS: FinancialCard[] = [
  {
    label: "Monthly Fee",
    value: "1,000",
    unit: "BDT",
    description: "One thousand taka only every month, for 11 consecutive years",
    variant: "dark",
  },
  {
    label: "Annual Fee",
    value: "5,000",
    unit: "BDT",
    description:
      "Five thousand taka only every year, for 11 consecutive years",
    variant: "dark",
  },
  {
    label: "Duration",
    value: "11",
    unit: "Years",
    description:
      "Total membership of 111 people — a strong and growing community",
    variant: "light",
  },
];

// ─── Savings Breakdown ─────────────────────────────────────────────────────────
export const SAVINGS_BREAKDOWN: SavingsBreakdownRow[] = [
  {
    id: "monthly",
    title: "Monthly Installments (11 years)",
    formula: "Monthly BDT 1,000 × 12 months = BDT 12,000/year\n1,200 × 111 × 11",
    total: "BDT 14,652,000",
    subtitle: "Fourteen million, six hundred fifty-two thousand taka",
  },
  {
    id: "annual",
    title: "Annual Fees (11 years)",
    formula: "BDT 5,000/year × 111 members × 11 years\n11 × 111 × 5,000",
    total: "BDT 6,105,000",
    subtitle: "Six million, one hundred five thousand taka",
  },
];

export const SAVINGS_GRAND_TOTAL = {
  label: "Grand Total",
  sublabel: "Monthly + Annual",
  formula: "14,652,000 + 6,105,000",
  total: "BDT 20,757,000",
  subtitle: "Twenty million, seven hundred fifty-seven thousand taka",
};

// ─── Team Members ──────────────────────────────────────────────────────────────
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "al-amin",
    name: "Md. Al Amin",
    role: "President",
    image: "/images/hero/hero-1.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
  {
    id: "mirajul-islam",
    name: "Md. Mirajul Islam",
    role: "Vice President",
    image: "/images/hero/hero-3.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
  {
    id: "jewel-hasan",
    name: "Md. Jewel Hasan",
    role: "General Secretary",
    image: "/images/hero/hero-2.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
  {
    id: "fazle-rabbi",
    name: "Md. Fazle Rabbi",
    role: "Treasurer",
    image: "/images/about/about-1.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
  {
    id: "rakibul-hasan",
    name: "Md. Rakibul Hasan",
    role: "Assistant Secretary",
    image: "/images/hero/hero-4.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
  {
    id: "shahin-alam",
    name: "Md. Shahin Alam",
    role: "Executive Member",
    image: "/images/hero/hero-5.png",
    social: { facebook: "#", linkedin: "#", twitter: "#" },
  },
];

// ─── News Articles ──────────────────────────────────────────────────────────────────────────────
export const NEWS_ARTICLES: NewsArticle[] = [
  { id: "1",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026" },
  { id: "2",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-2" },
  { id: "3",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-3" },
  { id: "4",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-4" },
  { id: "5",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-5" },
  { id: "6",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-6" },
  { id: "7",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-7" },
  { id: "8",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-8" },
  { id: "9",  author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-9" },
  { id: "10", author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-10" },
  { id: "11", author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-11" },
  { id: "12", author: "Admin", date: "July 10, 2024", title: "Annual General Meeting 2026 — All Members Invited", titleBn: "বার্ষিক সাধারণ সভা ২০২৬ — সকল সদস্য আমন্ত্রিত", image: "/images/hero/hero-2.png", images: ["/images/hero/hero-2.png", "/images/hero/hero-2.png", "/images/hero/hero-2.png"], slug: "annual-general-meeting-2026-12" },
];

// ─── Footer Columns ────────────────────────────────────────────────────────────
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Organization",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Mission", href: "#about" },
      { label: "Structure & Policy", href: "#policy" },
      { label: "Annual Report", href: "#" },
    ],
  },
  {
    heading: "Membership",
    links: [
      { label: "How to Join", href: "#" },
      { label: "Member Portal", href: "#" },
      { label: "Savings Fund", href: "#policy" },
      { label: "Dividend Policy", href: "#policy" },
    ],
  },
];
