"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { NotificationBlocker } from "@/components/shared/NotificationBlocker";

export default function StandaloneDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Loading skeleton while validating session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#00B074] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // Prevent any content flash/leak if unauthenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const role = (user.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "superadmin" || role === "manager";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {!isAdmin && <DashboardNav />}
      <div className="flex flex-1">
        {isAdmin && (
          <AdminSidebar
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {isAdmin && (
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-[#00B074]" />
              </button>
              <span className="font-bold text-sm text-gray-800 tracking-tight">
                Friends Goal Admin
              </span>
              <div className="w-7" />
            </header>
          )}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <NotificationBlocker />
    </div>
  );
}
