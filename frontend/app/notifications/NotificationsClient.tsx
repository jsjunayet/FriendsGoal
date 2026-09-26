"use client";

import { useState } from "react";
import { Check, Info, AlertTriangle, Menu } from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

interface FullNotificationItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  timestamp: string;
  timeAgo: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  description: string;
  category: "approvals" | "alerts" | "system" | "info" | "collection" | "member";
  unread: boolean;
  bgTint: string;
  iconBg: string;
  iconColor: string;
  iconType: "check" | "info" | "alert";
}

const ALL_NOTIFICATIONS: FullNotificationItem[] = [
  {
    id: "notif-1",
    title: "Withdrawal request pending",
    badge: "Action needed",
    badgeColor: "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]",
    timestamp: "Today, 10:42 AM",
    timeAgo: "2m ago",
    author: "Fatema Begum",
    authorInitials: "FB",
    authorColor: "bg-[#F472B6] text-white",
    description:
      "Fatema Begum has submitted a new withdrawal request for ৳4,554. Please review and respond within 48 hours.",
    category: "approvals",
    unread: true,
    bgTint: "bg-[#F3FBF7] border-l-4 border-l-[#10B981]",
    iconBg: "bg-[#DCFCE7]",
    iconColor: "text-[#16A34A]",
    iconType: "check",
  },
  {
    id: "notif-2",
    title: "Payment recorded",
    badge: "Collection",
    badgeColor: "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]",
    timestamp: "Today, 10:20 AM",
    timeAgo: "18m ago",
    author: "Sajid Mahmud",
    authorInitials: "SM",
    authorColor: "bg-[#3B82F6] text-white",
    description:
      "Sajid Mahmud recorded a monthly collection of ৳1,200 for MD Belal Hossain for the September cycle.",
    category: "info",
    unread: true,
    bgTint: "bg-[#F0F7FF] border-l-4 border-l-[#3B82F6]",
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#2563EB]",
    iconType: "info",
  },
  {
    id: "notif-3",
    title: "Interest rate changed",
    badge: "System change",
    badgeColor: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]",
    timestamp: "Today, 09:44 AM",
    timeAgo: "1h ago",
    author: "Nusrat Akter",
    authorInitials: "NA",
    authorColor: "bg-[#F97316] text-white",
    description:
      "Nusrat Akter updated the system interest rate from 5.5% to 6.0%. This affects all active loan accounts.",
    category: "system",
    unread: true,
    bgTint: "bg-[#FFF5F5] border-l-4 border-l-[#EF4444]",
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    iconType: "alert",
  },
  {
    id: "notif-4",
    title: "Withdrawal approved",
    badge: "Approved",
    badgeColor: "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]",
    timestamp: "Today, 07:44 AM",
    timeAgo: "3h ago",
    author: "Nusrat Akter",
    authorInitials: "NA",
    authorColor: "bg-[#F97316] text-white",
    description:
      "John Doe's withdrawal request WD-C9G4H6 was approved by Nusrat Akter. Disbursement is in progress.",
    category: "approvals",
    unread: true,
    bgTint: "bg-[#F3FBF7] border-l-4 border-l-[#10B981]",
    iconBg: "bg-[#DCFCE7]",
    iconColor: "text-[#16A34A]",
    iconType: "check",
  },
  {
    id: "notif-5",
    title: "New member registered",
    badge: "Member",
    badgeColor: "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]",
    timestamp: "Today, 05:44 AM",
    timeAgo: "5h ago",
    author: "Rania Islam",
    authorInitials: "RI",
    authorColor: "bg-[#0D9488] text-white",
    description:
      "Rania Islam successfully registered Rina Khatun as a new member with an initial deposit of ৳5,000.",
    category: "info",
    unread: true,
    bgTint: "bg-[#F0F7FF] border-l-4 border-l-[#3B82F6]",
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#2563EB]",
    iconType: "info",
  },
];

const TABS = [
  { id: "all", label: "All 12", count: 12 },
  { id: "unread", label: "Unread 5", count: 5 },
  { id: "approvals", label: "Approvals 2", count: 2 },
  { id: "alerts", label: "Alerts 4", count: 4 },
  { id: "system", label: "System 3", count: 3 },
  { id: "info", label: "Info 3", count: 3 },
];

export default function NotificationsClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return item.unread;
    if (activeTab === "approvals") return item.category === "approvals";
    if (activeTab === "system") return item.category === "system";
    if (activeTab === "alerts") return item.category === "alerts" || item.category === "system";
    if (activeTab === "info") return item.category === "info" || item.category === "member";
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Admin Sidebar */}
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
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

        {/* Notifications Card Container matching Screenshot 3 */}
        <div className="bg-white rounded-2xl border border-[#EDF2F7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          {/* Card subheader */}
          <div className="px-6 py-3.5 border-b border-gray-100 bg-[#FAFAFA]">
            <h2 className="text-[13px] font-bold text-gray-700">
              {activeTab === "all"
                ? "All (12)"
                : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (${filteredNotifications.length})`}
            </h2>
          </div>

          {/* List items */}
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 transition-colors ${item.bgTint} hover:opacity-95`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Category icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.iconType === "check" && <Check className="w-4 h-4 stroke-[2.5]" />}
                    {item.iconType === "info" && <Info className="w-4 h-4 stroke-[2.5]" />}
                    {item.iconType === "alert" && (
                      <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-gray-900 leading-tight">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-400">{item.timestamp}</span>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    <p className="text-[13px] text-gray-600 leading-relaxed mt-1.5">
                      {item.description}
                    </p>

                    {/* Author & time ago */}
                    <div className="flex items-center gap-2 mt-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${item.authorColor}`}
                      >
                        {item.authorInitials}
                      </div>
                      <span className="text-[11.5px] text-gray-500 font-medium">
                        {item.author} • {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="p-12 text-center text-gray-400 text-sm">
                No notifications found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
