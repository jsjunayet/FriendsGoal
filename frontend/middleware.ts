/**
 * Next.js Edge Middleware — route protection for Friends Goal.
 *
 * Protected route map:
 *   /dashboard/**       → any authenticated user
 *   /admin/dashboard/** → admin or superAdmin only
 *
 * Token is read from sessionStorage on the client, but middleware runs on
 * the Edge before React hydrates. We bridge this by having the login page
 * write a lightweight non-HttpOnly cookie "fg_auth_role" alongside the
 * sessionStorage write so the middleware can read it.
 *
 * Cookie written by AuthContext: "fg_auth_role" = role string (e.g. "admin")
 * Cookie written by AuthContext: "fg_auth"      = "1"  (presence flag)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/", "/about", "/policy", "/faq", "/gallery", "/members", "/notice", "/council"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js internals and static assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = request.cookies.get("fg_auth")?.value === "1";
  const role = request.cookies.get("fg_auth_role")?.value ?? "";

  // ── /admin/** ─────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin" && role !== "superAdmin") {
      // Authenticated but wrong role — send to their own dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── /dashboard/** ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Admins who land on /dashboard should go to their admin dashboard
    if (role === "admin" || role === "superAdmin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── /login — bounce already-authenticated users ───────────────────────────
  if (pathname === "/login" && isLoggedIn) {
    const dest =
      role === "admin" || role === "superAdmin"
        ? "/admin/dashboard"
        : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
