"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Shield, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationPopover } from "./NotificationPopover";
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/lib/hooks/useNotifications";

// Role label map
const ROLE_LABELS: Record<string, string> = {
  superAdmin: "Super Admin",
  admin: "Admin",
  member: "Member",
};

export function DashboardNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading: isNotifLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "Member";
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-8 h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#1FDE64] flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M10 2.5C10 2.5 4.5 6.5 4.5 11.5C4.5 14.54 7.19 17 10 17C12.81 17 15.5 14.54 15.5 11.5C15.5 6.5 10 2.5 10 2.5Z"
                fill="white"
              />
              <circle cx="10" cy="11.5" r="2.8" fill="#1FDE64" />
            </svg>
          </div>
          <span className="font-bold text-[#1A1A1A] text-[16px] tracking-tight">
            Friends Goal
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role badge — visible on sm+ */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 h-[30px] px-3 rounded-full bg-[#F6FFED] border border-[#D4F5D2]">
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-[#2B5A27]" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#2B5A27]" />
              )}
              <span className="text-[12px] font-bold text-[#2B5A27] uppercase tracking-wide">
                {roleLabel}
              </span>
            </div>
          )}

          {/* Real-time Dynamic Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#555555] hover:bg-[#F3F4F6] transition-colors focus:outline-none cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {/* Dynamic Unread Badge - completely hidden when 0 unread */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75 duration-150">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationPopover
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              notifications={notifications}
              unreadCount={unreadCount}
              isLoading={isNotifLoading}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#555555] hover:bg-[#FFF0F0] hover:text-[#ef4444] transition-colors cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
