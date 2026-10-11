export interface IBilingualText {
  bn?: string;
  en?: string;
}

/**
  * Safely resolves a bilingual text object or string based on current language preference.
  */
export function getLocalizedText(
  value: IBilingualText | string | null | undefined,
  lang: "bn" | "en",
  fallback = ""
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  
  if (lang === "bn") {
    return value.bn || value.en || fallback;
  } else {
    return value.en || value.bn || fallback;
  }
}

/**
 * Returns true if an image URL or array is valid and non-empty.
 */
export function hasValidImage(images?: string[] | string | null): boolean {
  if (!images) return false;
  if (typeof images === "string") return images.trim().length > 0;
  if (Array.isArray(images)) return images.length > 0 && images.some((img) => img && img.trim().length > 0);
  return false;
}

/**
 * Resolves an image URL (normalizes local /uploads/ to same-origin paths, preserves external HTTPS URLs).
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }
  // If it's a local upload (either relative /uploads/... or http://localhost:5000/uploads/...)
  // Normalize to /uploads/... so the browser fetches same-origin via Next.js rewrite or static public
  if (trimmed.includes("/uploads/")) {
    return trimmed.slice(trimmed.indexOf("/uploads/"));
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Safely extracts an array of image strings from string | string[] | null | undefined.
 */
export function getImageList(images?: string[] | string | null): string[] {
  if (!images) return [];
  if (typeof images === "string") {
    const trimmed = resolveImageUrl(images);
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(images)) {
    return images
      .map((img) => resolveImageUrl(img))
      .filter((img) => Boolean(img && img.trim().length > 0));
  }
  return [];
}

