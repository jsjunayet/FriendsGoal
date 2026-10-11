/**
 * Next.js Edge Middleware — High Security Route Protection for Friends Goal.
 *
 * Verifies JWT integrity and expiration at the Edge before allowing requests
 * into protected administrative and member financial sections.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedEdgePayload {
  userId: string;
  role: string;
  exp?: number;
}

function decodeJwtPayloadEdge(token: string | undefined): DecodedEdgePayload | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json) as DecodedEdgePayload;

    // Check expiration (exp is in seconds)
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    if (!payload.userId || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function purgeAuthCookies(response: NextResponse) {
  response.cookies.set("fg_auth", "", { maxAge: 0, path: "/" });
  response.cookies.set("fg_auth_role", "", { maxAge: 0, path: "/" });
  response.cookies.set("fg_token", "", { maxAge: 0, path: "/" });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass Next.js internal files, api routes, and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. Validate JWT Token from cookie
  const rawToken = request.cookies.get("fg_token")?.value;
  const decodedToken = decodeJwtPayloadEdge(rawToken);

  // Fallback check on presence flags only if valid token payload exists
  const hasAuthFlag = request.cookies.get("fg_auth")?.value === "1";
  const isValidSession = Boolean(decodedToken && hasAuthFlag);

  const userRole = (decodedToken?.role || request.cookies.get("fg_auth_role")?.value || "").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  // ── 2. Route Protection: /admin/** ──────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isValidSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      return purgeAuthCookies(redirectRes);
    }

    if (!isAdmin) {
      // Authenticated but insufficient privileges
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ── 3. Route Protection: /dashboard/** ──────────────────────────────────────
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isValidSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      return purgeAuthCookies(redirectRes);
    }

    // Admin-only sub-routes under /dashboard/ (e.g., /dashboard/member directory)
    if (pathname === "/dashboard/member" || pathname === "/dashboard/member/") {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  // ── 4. Route Protection: /notifications/** ──────────────────────────────────
  if (pathname.startsWith("/notifications")) {
    if (!isValidSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      return purgeAuthCookies(redirectRes);
    }
    return NextResponse.next();
  }

  // ── 5. Redirect Already-Authenticated Users Away from /login ────────────────
  if (pathname === "/login" && isValidSession) {
    const dest = isAdmin ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
