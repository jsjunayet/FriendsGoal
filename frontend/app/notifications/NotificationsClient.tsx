"use client";

import { useState } from "react";
import {
  Check,
  Info,
  AlertTriangle,
  Menu,
  AlertCircle,
  CreditCard,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { INotification } from "@/lib/notificationApi";

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function NotificationsClient() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading: loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "superAdmin" ||
    user?.role === "manager";

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !item.isRead;
    return true;
  });

  const getIconData = (type: string) => {
    switch (type) {
      case "WITHDRAWAL_REQUEST":
        return {
          icon: <CreditCard className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#EFF6FF]",
          iconColor: "text-[#2563EB]",
          bgTint: "bg-[#F4F8FD] border-l-4 border-l-[#2563EB]",
          badge: "Withdrawal",
          badgeColor: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
        };
      case "DEPOSIT_SUCCESS":
        return {
          icon: <Check className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#EAF8F1]",
          iconColor: "text-[#00B074]",
          bgTint: "bg-[#F2FBF6] border-l-4 border-l-[#00B074]",
          badge: "Deposit Recorded",
          badgeColor: "bg-[#EAF8F1] text-[#00B074] border border-[#A7F3D0]",
        };
      case "DUE_ALERT":
        return {
          icon: <Info className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#FEF3C7]",
          iconColor: "text-[#D97706]",
          bgTint: "bg-[#FFFBEB] border-l-4 border-l-[#F59E0B]",
          badge: "Due Alert",
          badgeColor: "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]",
        };
      case "SUPERADMIN_SECURITY_ALERT":
        return {
          icon: <AlertTriangle className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#FEE2E2]",
          iconColor: "text-[#DC2626]",
          bgTint: "bg-[#FFF5F5] border-l-4 border-l-[#EF4444]",
          badge: "System Alert",
          badgeColor: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]",
        };
      case "DIRECT_ADMIN_MSG":
        return {
          icon: <MessageSquare className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#F3E8FF]",
          iconColor: "text-[#7E22CE]",
          bgTint: "bg-[#FAF5FF] border-l-4 border-l-[#A855F7]",
          badge: "Admin Notice",
          badgeColor: "bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]",
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 stroke-[2.5]" />,
          iconBg: "bg-[#F1F5F9]",
          iconColor: "text-[#64748B]",
          bgTint: "bg-white border-l-4 border-l-[#CBD5E1]",
          badge: "System",
          badgeColor: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
        };
    }
  };

  const TABS = [
    { id: "all" as const, label: `All ${notifications.length}` },
    { id: "unread" as const, label: `Unread ${unreadCount}` },
  ];

  const content = (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
              Notifications
            </h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[12.5px] font-semibold text-gray-700 transition-colors shadow-xs w-fit cursor-pointer"
        >
          <Check className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
          Mark all as read
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#00B074] text-white shadow-xs font-semibold"
                  : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications Card Container matching previous design */}
      <div className="bg-white rounded-2xl border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
        {/* Card subheader */}
        <div className="px-6 py-3.5 border-b border-gray-100 bg-[#FAFAFA]">
          <h2 className="text-[13px] font-bold text-gray-700">
            {activeTab === "all"
              ? `All (${notifications.length})`
              : `Unread (${filteredNotifications.length})`}
          </h2>
        </div>

        {/* List items */}
        <div className="divide-y divide-gray-100 min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No notifications found.
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const ui = getIconData(item.type);
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) {
                      markAsRead(item._id);
                    }
                  }}
                  className={`p-4 sm:p-5 transition-colors cursor-pointer ${
                    !item.isRead
                      ? ui.bgTint
                      : "bg-white border-l-4 border-l-transparent hover:bg-gray-50/60"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Category icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ui.iconBg} ${ui.iconColor}`}
                    >
                      {ui.icon}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[14px] font-semibold text-gray-900 leading-tight">
                            {item.title}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ui.badgeColor}`}
                          >
                            {ui.badge}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 text-gray-400">
                          <span className="text-[11px] font-medium hidden sm:inline-block">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                          {!item.isRead && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                              <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                            </>
                          )}
                        </div>
                      </div>

                      <div
                        className="text-[13px] text-gray-600 leading-relaxed mt-1.5"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />

                      {/* Author Meta */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#F472B6] text-white">
                          S
                        </div>
                        <span className="text-[12px] font-semibold text-gray-500">
                          System
                        </span>
                        <span className="text-gray-300 mx-1">•</span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

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
        <main className="flex-1 min-w-0 flex flex-col">{content}</main>
      </div>
    </div>
  );
}
