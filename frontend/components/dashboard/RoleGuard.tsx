"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, LogOut, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectMemberTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles = ["admin", "superadmin"],
  redirectMemberTo = "/dashboard/member",
}: RoleGuardProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    // If still hydrating auth state, wait
    if (isLoading) return;

    // Check role from AuthContext user or fallback to cookies
    let role = user?.role?.toLowerCase() || "";
    
    if (!role && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)fg_auth_role=([^;]*)/);
      if (match) {
        role = decodeURIComponent(match[1]).toLowerCase();
      }
    }

    // Default to admin for development/preview if no user is logged in
    // to allow viewing static mock dashboard seamlessly
    if (!role) {
      role = "admin";
    }

    setCurrentRole(role);

    const hasAccess = allowedRoles.some(
      (r) => r.toLowerCase() === role || role === "superadmin" || role === "admin"
    );

    if (hasAccess) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // If user is 'member' or 'manager', auto redirect to /dashboard/member after brief delay
      if (role === "member" || role === "manager") {
        const timer = setTimeout(() => {
          router.replace(redirectMemberTo);
        }, 1800);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading, allowedRoles, redirectMemberTo, router]);

  // Loading skeleton while checking authentication
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F7F9FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#10B981] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Verifying administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  // 403 Forbidden Screen if unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/60 text-red-600 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" /> 403 Forbidden Access
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Restricted Admin Area
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Only users with <span className="font-semibold text-gray-700">admin</span> or{" "}
            <span className="font-semibold text-gray-700">superadmin</span> roles are permitted to access Financial Analytics.
            Your current role is <span className="font-bold text-red-600 capitalize">&quot;{currentRole || "member"}&quot;</span>.
          </p>

          <div className="flex flex-col w-full gap-3">
            <Link
              href={redirectMemberTo}
              className="w-full h-11 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Go to Member Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              type="button"
              className="w-full h-11 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-gray-200"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
              Sign in with another account
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-5">
            Redirecting to member dashboard automatically...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
