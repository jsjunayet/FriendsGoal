"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COUNCIL_CATEGORY_MAP = exports.getDesignationBn = exports.DESIGNATION_MAP = void 0;
exports.DESIGNATION_MAP = {
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
const getDesignationBn = (designation) => {
    if (!designation)
        return "সাধারণ সদস্য";
    return exports.DESIGNATION_MAP[designation] || designation;
};
exports.getDesignationBn = getDesignationBn;
exports.COUNCIL_CATEGORY_MAP = {
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
//# sourceMappingURL=member.utils.js.map