/**
 * Secure authentication utilities for Friends Goal.
 * Provides unified cookie, storage, and session clearance helpers.
 */

export const STORAGE_KEY_TOKEN = "fg_access_token";

export interface DecodedAuthUser {
  userId: string;
  role: string;
  exp?: number;
}

/**
 * Safely decodes a JWT token without external libraries.
 * Rejects expired tokens or tokens missing required fields.
 */
export function decodeJwtPayload(token: string): DecodedAuthUser | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json) as {
      userId?: string;
      role?: string;
      exp?: number;
    };

    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    if (!payload.userId || !payload.role) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves access token from browser storage (sessionStorage or localStorage).
 */
export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token =
      sessionStorage.getItem(STORAGE_KEY_TOKEN) ||
      localStorage.getItem(STORAGE_KEY_TOKEN) ||
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");

    if (!token) return null;

    // Verify token validity
    const decoded = decodeJwtPayload(token);
    if (!decoded) {
      // Token is invalid/expired - clear it immediately
      clearClientAuth();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

/**
 * Completely clears all client-side auth tokens, storage entries, and cookies.
 * Dispatches an auth logout event and optionally redirects to /login.
 */
export function clearClientAuth(shouldRedirect = true): void {
  if (typeof window === "undefined") return;

  try {
    // Clear storage
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem("accessToken");
  } catch (_) {}

  try {
    // Clear cookies with all domain/path permutations
    const expiredSuffix = "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax";
    document.cookie = `fg_auth${expiredSuffix}`;
    document.cookie = `fg_auth_role${expiredSuffix}`;
    document.cookie = `fg_token${expiredSuffix}`;
  } catch (_) {}

  // Dispatch custom event for real-time listeners across open tabs/components
  try {
    window.dispatchEvent(new Event("fg_auth_logout"));
  } catch (_) {}

  // Redirect to login if requested and not already on the login page
  if (shouldRedirect && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

/**
 * Sets auth cookies for edge middleware (30-day session max-age).
 */
export function setAuthCookies(accessToken: string, role: string): void {
  if (typeof document === "undefined") return;
  const maxAge = 2592000; // 30 days in seconds
  document.cookie = `fg_auth=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `fg_auth_role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `fg_token=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
