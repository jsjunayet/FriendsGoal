"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { NotificationBlocker } from "@/components/shared/NotificationBlocker";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile top-bar toggle for screen width < 1024px */}
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

        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <NotificationBlocker />
    </div>
  );
}
