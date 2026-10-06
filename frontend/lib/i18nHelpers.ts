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
 * Extracts array of image URLs safely.
 */
export function getImageList(images?: string[] | string | null): string[] {
  if (!images) return [];
  if (typeof images === "string") return [images];
  if (Array.isArray(images)) return images.filter((img) => Boolean(img && img.trim()));
  return [];
}
