"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { NotificationBlocker } from "@/components/shared/NotificationBlocker";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin" || user?.role === "manager";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {!isAdmin && <DashboardNav />}
      <div className="flex flex-1 overflow-hidden">
        {isAdmin && (
          <AdminSidebar
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <NotificationBlocker />
    </div>
  );
}
