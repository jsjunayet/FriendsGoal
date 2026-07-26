// ─── Translation Dictionary ────────────────────────────────────────────────────
export type Lang = "en" | "bn";

const en = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  nav_policy: "Policy",
  nav_councils: "Council's",
  nav_executive_council: "Executive Council",
  nav_financial_council: "Financial Council",
  nav_members: "Members",
  nav_about: "About Us",
  nav_gallery: "Gallery",
  nav_notice: "Notice",
  nav_faq: "FAQ",
  nav_login: "Log In",
  nav_exec_desc: "Board members & elected leadership",
  nav_fin_desc: "Savings, investment & treasury oversight",

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero_tag: "ESTABLISHED 2024",
  hero_headline: "Let's Go Together, Inshallah.",
  hero_description:
    "A community built on trust, mutual support, and interest-free financial growth. We are rewriting the future of shared prosperity through collective commitment.",
  hero_cta: "Explore More",
  hero_marquee: "Upcoming General Meeting: Join us on 15 August 2026 at 6:00 PM",

  // ── About ───────────────────────────────────────────────────────────────────
  about_tag: "ABOUT US",
  about_heading: "Building a Self-Reliant Financial Community",
  about_para1:
    "Friends Goal is a self-development economic organization founded on 1 January 2024 in Dhaka, Bangladesh. Our mission is to enable members to build self-reliant lives through interest-free savings, collective investment, and transparent financial management.",
  about_para2:
    "Operating nationwide, we bring together friends and community members under one shared vision — working together, growing together. Through our structured departments and democratic governance, we ensure every member's voice is heard and every taka is accounted for.",
  about_bullet1: "Nationwide operational coverage across Bangladesh",
  about_bullet2: "Democratic board structure with elected representatives",
  about_bullet3: "Fully transparent financial reporting every month",
  about_cta: "Read More",

  // ── Vision / Mission ────────────────────────────────────────────────────────
  vision_title: "Our Vision",
  vision_text:
    "To foster a global community where collective financial strength and interest-free growth are the standard, empowering every individual to achieve prosperity through unity and shared values.",
  mission_title: "Our Mission",
  mission_text:
    "Providing a transparent, mutual-support platform that enables members to build self-reliant lives through systematic savings, collective investment, and a commitment to interest-free financial ethics.",
  mission_badge: "COLLECTIVE GROWTH",

  // ── Stats ────────────────────────────────────────────────────────────────────
  stats_members: "ACTIVE MEMBERS",
  stats_projects: "Projects",
  stats_years: "Years Serving",

  // ── Team ─────────────────────────────────────────────────────────────────────
  team_tag: "OUR TEAM",
  team_heading: "Founding Members",
  team_subtitle: "Those who came together from day one to turn this vision into reality.",

  // ── Gallery ──────────────────────────────────────────────────────────────────
  gallery_tag: "OUR GALLERY",
  gallery_heading: "Impact in Motion",
  gallery_subtitle:
    "A glimpse into our collective journey of empowerment and collaborative growth.",
  gallery_see_more: "See More",

  // ── News ──────────────────────────────────────────────────────────────────────
  news_tag: "UPDATES",
  news_heading: "News & Stories",
  news_description:
    "Stay informed with the latest updates, announcements, and community highlights from the Friends Goal team.",
  news_view_all: "View All",
  news_read_more: "Read More",

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer_brand_desc:
    "A self-development economic organization enabling members to build self-reliant lives through interest-free savings.",
  footer_org_col: "ORGANIZATION",
  footer_membership_col: "MEMBERSHIP",
  footer_contact_col: "CONTACT",
  footer_office: "OFFICE",
  footer_policy: "Policy",
  footer_about: "About Us",
  footer_gallery: "Gallery",
  footer_notice: "Notice",
  footer_faq: "FAQ",
  footer_members: "Members",
  footer_member_portal: "Member Portal",
  footer_contact_admin: "Admin",
  footer_copyright: "© 2024 Friends Goal. Built for collective prosperity.",
  footer_dev: "Developed by",

  // ── Common ───────────────────────────────────────────────────────────────────
  home: "HOME",
  all_filter: "ALL",
  load_more: "LOAD MORE",
  load_less: "LOAD LESS",
  search_dir: "Search directory...",
  back: "← Back",

  // ── Inner page heroes ─────────────────────────────────────────────────────────
  about_page_crumb: "OUR STORY",
  about_page_title1: "Cultivating Trust,",
  about_page_title2: "Empowering Growth",
  about_page_desc:
    "We are more than a savings group — we are a movement built on collective ambition, trust, and the shared belief that financial freedom is possible for all.",

  policy_page_crumb: "POLICY",
  policy_page_title: "Our Policy",
  policy_page_desc:
    "Transparent guidelines that govern our organization, protect our members, and uphold our commitment to interest-free financial ethics.",

  members_page_crumb: "MEMBERS",
  members_page_title: "Our Members",
  members_page_desc:
    "Connect with individuals making a difference. Search by name, designation, or region.",

  notice_page_crumb: "UPDATES",
  notice_page_title: "News & Stories",
  notice_page_desc:
    "Stay informed with the latest updates, announcements, and community highlights from the Friends Goal team.",

  gallery_page_crumb: "GALLERY",
  gallery_page_title: "Our Photo Gallery",
  gallery_page_desc:
    "Explore moments, events, and activities from the Friends Goal community.",

  faq_page_crumb: "FAQ",
  faq_page_title: "Frequently Asked Questions",
  faq_page_desc:
    "Find answers to the most common questions about Friends Goal, our savings process, membership, and governance.",

  executive_page_crumb: "LEADERSHIP",
  executive_page_title: "Executive Council",
  financial_page_crumb: "LEADERSHIP",
  financial_page_title: "Financial Council",

  // ── Notice Detail ─────────────────────────────────────────────────────────────
  official_notice: "OFFICIAL NOTICE",
  agenda_highlights: "Agenda Highlights",
} as const;

const bn: Record<keyof typeof en, string> = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  nav_policy: "নীতিমালা",
  nav_councils: "কাউন্সিল",
  nav_executive_council: "নির্বাহী কাউন্সিল",
  nav_financial_council: "আর্থিক কাউন্সিল",
  nav_members: "সদস্যবৃন্দ",
  nav_about: "আমাদের সম্পর্কে",
  nav_gallery: "গ্যালারি",
  nav_notice: "নোটিশ",
  nav_faq: "প্রশ্নোত্তর",
  nav_login: "লগইন",
  nav_exec_desc: "পর্ষদ সদস্য ও নির্বাচিত নেতৃত্ব",
  nav_fin_desc: "সঞ্চয়, বিনিয়োগ ও কোষাগার তত্ত্বাবধান",

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero_tag: "প্রতিষ্ঠিত ২০২৪",
  hero_headline: "চলুন একসাথে এগিয়ে যাই, ইনশাআল্লাহ।",
  hero_description:
    "আস্থা, পারস্পরিক সহায়তা ও সুদমুক্ত আর্থিক প্রবৃদ্ধির উপর ভিত্তি করে গড়ে ওঠা একটি সম্প্রদায়। সম্মিলিত প্রতিশ্রুতির মাধ্যমে আমরা ভাগ করা সমৃদ্ধির ভবিষ্যৎ রচনা করছি।",
  hero_cta: "আরও জানুন",
  hero_marquee: "আসন্ন সাধারণ সভা: ১৫ আগস্ট ২০২৬ সন্ধ্যা ৬:০০ টায় আমাদের সাথে যোগ দিন",

  // ── About ───────────────────────────────────────────────────────────────────
  about_tag: "আমাদের সম্পর্কে",
  about_heading: "একটি স্বনির্ভর আর্থিক সম্প্রদায় গড়ে তোলা",
  about_para1:
    "ফ্রেন্ডস গোল একটি স্ব-উন্নয়নমূলক অর্থনৈতিক সংগঠন যা ১ জানুয়ারি ২০২৪ সালে ঢাকা, বাংলাদেশে প্রতিষ্ঠিত হয়েছে। আমাদের লক্ষ্য হলো সদস্যদের সুদমুক্ত সঞ্চয়, সামগ্রিক বিনিয়োগ এবং স্বচ্ছ আর্থিক ব্যবস্থাপনার মাধ্যমে স্বনির্ভর জীবন গড়তে সক্ষম করা।",
  about_para2:
    "সারাদেশে কার্যক্রম পরিচালনা করে, আমরা বন্ধু ও সম্প্রদায়ের সদস্যদের একটি ভাগ করা দৃষ্টিভঙ্গির অধীনে একত্রিত করি — একসাথে কাজ করা, একসাথে বৃদ্ধি পাওয়া। আমাদের কাঠামোবদ্ধ বিভাগ ও গণতান্ত্রিক পরিচালনার মাধ্যমে আমরা নিশ্চিত করি যে প্রতিটি সদস্যের কণ্ঠস্বর শোনা হয় এবং প্রতিটি টাকার হিসাব রাখা হয়।",
  about_bullet1: "সারাদেশে কার্যক্রমের বিস্তার",
  about_bullet2: "নির্বাচিত প্রতিনিধিদের নিয়ে গণতান্ত্রিক পর্ষদ কাঠামো",
  about_bullet3: "প্রতি মাসে সম্পূর্ণ স্বচ্ছ আর্থিক প্রতিবেদন",
  about_cta: "আরও পড়ুন",

  // ── Vision / Mission ────────────────────────────────────────────────────────
  vision_title: "আমাদের লক্ষ্য",
  vision_text:
    "একটি বৈশ্বিক সম্প্রদায় গড়ে তোলা যেখানে সম্মিলিত আর্থিক শক্তি ও সুদমুক্ত প্রবৃদ্ধি মানদণ্ড হবে এবং প্রতিটি ব্যক্তি ঐক্য ও ভাগ করা মূল্যবোধের মাধ্যমে সমৃদ্ধি অর্জন করতে পারবে।",
  mission_title: "আমাদের মিশন",
  mission_text:
    "একটি স্বচ্ছ, পারস্পরিক সহায়তার প্ল্যাটফর্ম প্রদান করা যা সদস্যদের পদ্ধতিগত সঞ্চয়, সামগ্রিক বিনিয়োগ এবং সুদমুক্ত আর্থিক নীতির প্রতি প্রতিশ্রুতির মাধ্যমে স্বনির্ভর জীবন গড়তে সক্ষম করে।",
  mission_badge: "সম্মিলিত সমৃদ্ধি",

  // ── Stats ────────────────────────────────────────────────────────────────────
  stats_members: "সক্রিয় সদস্য",
  stats_projects: "প্রকল্পসমূহ",
  stats_years: "সেবার বছর",

  // ── Team ─────────────────────────────────────────────────────────────────────
  team_tag: "আমাদের দল",
  team_heading: "প্রতিষ্ঠাতা সদস্যবৃন্দ",
  team_subtitle: "যারা এই স্বপ্নকে বাস্তবে রূপ দিতে প্রথম দিন থেকে একত্রিত হয়েছিলেন।",

  // ── Gallery ──────────────────────────────────────────────────────────────────
  gallery_tag: "আমাদের গ্যালারি",
  gallery_heading: "পরিবর্তনের পথে",
  gallery_subtitle:
    "ক্ষমতায়ন ও সহযোগিতামূলক প্রবৃদ্ধির আমাদের সম্মিলিত যাত্রার একটি ঝলক।",
  gallery_see_more: "আরও দেখুন",

  // ── News ──────────────────────────────────────────────────────────────────────
  news_tag: "আপডেট",
  news_heading: "সংবাদ ও গল্প",
  news_description:
    "ফ্রেন্ডস গোল দলের সর্বশেষ আপডেট, ঘোষণা ও সম্প্রদায়ের হাইলাইট সম্পর্কে অবহিত থাকুন।",
  news_view_all: "সব দেখুন",
  news_read_more: "আরও পড়ুন",

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer_brand_desc:
    "একটি স্ব-উন্নয়নমূলক অর্থনৈতিক সংগঠন যা সদস্যদের সুদমুক্ত সঞ্চয়ের মাধ্যমে স্বনির্ভর জীবন গড়তে সক্ষম করে।",
  footer_org_col: "সংগঠন",
  footer_membership_col: "সদস্যপদ",
  footer_contact_col: "যোগাযোগ",
  footer_office: "কার্যালয়",
  footer_policy: "নীতিমালা",
  footer_about: "আমাদের সম্পর্কে",
  footer_gallery: "গ্যালারি",
  footer_notice: "নোটিশ",
  footer_faq: "প্রশ্নোত্তর",
  footer_members: "সদস্যবৃন্দ",
  footer_member_portal: "সদস্য পোর্টাল",
  footer_contact_admin: "অ্যাডমিন",
  footer_copyright: "© ২০২৪ ফ্রেন্ডস গোল। সম্মিলিত সমৃদ্ধির জন্য নির্মিত।",
  footer_dev: "তৈরি করেছে",

  // ── Common ───────────────────────────────────────────────────────────────────
  home: "হোম",
  all_filter: "সব",
  load_more: "আরও লোড করুন",
  load_less: "কম দেখুন",
  search_dir: "ডিরেক্টরি অনুসন্ধান করুন...",
  back: "← ফিরে যান",

  // ── Inner page heroes ─────────────────────────────────────────────────────────
  about_page_crumb: "আমাদের গল্প",
  about_page_title1: "আস্থা অর্জন,",
  about_page_title2: "সমৃদ্ধি নিশ্চিতকরণ",
  about_page_desc:
    "আমরা শুধু একটি সঞ্চয় দল নই — আমরা একটি আন্দোলন যা সম্মিলিত উচ্চাকাঙ্ক্ষা, আস্থা এবং এই ভাগ করা বিশ্বাসের উপর প্রতিষ্ঠিত যে আর্থিক স্বাধীনতা সবার জন্য সম্ভব।",

  policy_page_crumb: "নীতিমালা",
  policy_page_title: "আমাদের নীতিমালা",
  policy_page_desc:
    "স্বচ্ছ নির্দেশিকা যা আমাদের সংগঠন পরিচালনা করে, আমাদের সদস্যদের রক্ষা করে এবং সুদমুক্ত আর্থিক নীতির প্রতি আমাদের প্রতিশ্রুতি বজায় রাখে।",

  members_page_crumb: "সদস্যবৃন্দ",
  members_page_title: "আমাদের সদস্যবৃন্দ",
  members_page_desc:
    "পরিবর্তন আনছেন এমন ব্যক্তিদের সাথে সংযুক্ত হন। নাম, পদবি বা অঞ্চল দিয়ে অনুসন্ধান করুন।",

  notice_page_crumb: "আপডেট",
  notice_page_title: "সংবাদ ও গল্প",
  notice_page_desc:
    "ফ্রেন্ডস গোল দলের সর্বশেষ আপডেট, ঘোষণা ও সম্প্রদায়ের হাইলাইট সম্পর্কে অবহিত থাকুন।",

  gallery_page_crumb: "গ্যালারি",
  gallery_page_title: "আমাদের ফটো গ্যালারি",
  gallery_page_desc:
    "ফ্রেন্ডস গোল সম্প্রদায়ের মুহূর্ত, ইভেন্ট এবং কার্যক্রম অন্বেষণ করুন।",

  faq_page_crumb: "প্রশ্নোত্তর",
  faq_page_title: "প্রায়শই জিজ্ঞাসিত প্রশ্নসমূহ",
  faq_page_desc:
    "ফ্রেন্ডস গোল, আমাদের সঞ্চয় প্রক্রিয়া, সদস্যপদ এবং পরিচালনা সম্পর্কে সবচেয়ে সাধারণ প্রশ্নের উত্তর খুঁজুন।",

  executive_page_crumb: "নেতৃত্ব",
  executive_page_title: "নির্বাহী কাউন্সিল",
  financial_page_crumb: "নেতৃত্ব",
  financial_page_title: "আর্থিক কাউন্সিল",

  // ── Notice Detail ─────────────────────────────────────────────────────────────
  official_notice: "আনুষ্ঠানিক নোটিশ",
  agenda_highlights: "এজেন্ডা হাইলাইট",
} // end bn

export const translations: Record<Lang, Record<string, string>> = { en, bn };
export type TranslationKey = keyof typeof en;

