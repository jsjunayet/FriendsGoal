export const DESIGNATION_MAP: Record<string, string> = {
  President: "সভাপতি",
  "Vice President": "সহ-সভাপতি",
  "General Secretary": "সাধারণ সম্পাদক",
  Secretary: "সচিব",
  "Assistant General Secretary": "সহকারী সাধারণ সম্পাদক",
  Treasurer: "কোষাধ্যক্ষ",
  "Organizing Secretary": "সাংগঠনিক সম্পাদক",
  "Executive Member": "নির্বাহী সদস্য",
  "Financial Member": "আর্থিক সদস্য",
  "General Member": "সাধারণ সদস্য",
};

export const getDesignationBn = (designation?: string): string => {
  if (!designation) return "সাধারণ সদস্য";
  return DESIGNATION_MAP[designation] || designation;
};

export const COUNCIL_CATEGORY_MAP: Record<string, { en: string; bn: string }> = {
  core_leadership: {
    en: "Executive Leadership",
    bn: "মূল নেতৃত্ব",
  },
  financial_leadership: {
    en: "Financial Leadership",
    bn: "আর্থিক নেতৃত্ব",
  },
  general_member: {
    en: "General Member",
    bn: "সাধারণ সদস্য",
  },
};
