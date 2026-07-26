// ─── Navigation ────────────────────────────────────────────────────────────────
export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

// ─── About Features ────────────────────────────────────────────────────────────
export interface FeatureItem {
  text: string;
}

// ─── Financial Plan ────────────────────────────────────────────────────────────
export interface FinancialCard {
  label: string;
  value: string;
  unit: string;
  description: string;
  variant: "dark" | "light";
}

export interface SavingsBreakdownRow {
  id: string;
  title: string;
  formula: string;
  total: string;
  subtitle: string;
}

// ─── Team ──────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// ─── News ──────────────────────────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  author: string;
  date: string;
  title: string;
  titleBn?: string;
  image?: string;
  images?: string[]; // Multiple images for the detail page slideshow
  slug: string;
}

// ─── Footer ────────────────────────────────────────────────────────────────────
export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

// ─── Directory Member ──────────────────────────────────────────────────────────
export interface DirectoryMember {
  id: string;
  memberId: string;
  name: string;
  role: string;
  location: string;
  dob: string;
  bloodGroup: string;
  image: string;
}
