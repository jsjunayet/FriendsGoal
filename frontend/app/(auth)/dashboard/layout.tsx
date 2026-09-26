"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

export default function DashboardLayout({
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
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
