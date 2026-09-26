"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "approval" | "collection" | "system" | "delete";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Withdrawal request pending",
    message: "Fatema Begum has submitted a new withdrawal request for ৳4,554.",
    time: "2m ago",
    unread: true,
    type: "approval",
  },
  {
    id: "2",
    title: "Payment recorded",
    message: "Sajid Mahmud recorded a collection of ৳1,200 for MD Belal Hossain.",
    time: "18m ago",
    unread: true,
    type: "collection",
  },
  {
    id: "3",
    title: "Interest rate changed",
    message: "Nusrat Akter updated the system interest rate from 5.5% to 6.0%.",
    time: "1h ago",
    unread: true,
    type: "system",
  },
  {
    id: "4",
    title: "Withdrawal approved",
    message: "John Doe's request WD-C9G4H6 was approved by Nusrat Akter.",
    time: "3h ago",
    unread: true,
    type: "approval",
  },
  {
    id: "5",
    title: "Member deleted",
    message: "Sajid Mahmud removed Ali Akbar after full settlement",
    time: "5h ago",
    unread: false,
    type: "delete",
  },
];

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export function NotificationPopover({ isOpen, onClose, onViewAll }: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "approval":
        return (
          <div className="w-6 h-6 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      case "collection":
        return (
          <div className="w-6 h-6 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      case "system":
        return (
          <div className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      case "delete":
        return (
          <div className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <>
      {/* Click-away backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover container matching Screenshot 2 */}
      <div className="absolute right-0 top-12 z-50 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-[#10B981] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[12px] font-medium text-[#10B981] hover:text-[#059669] hover:underline transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        {/* List items */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 transition-colors hover:bg-gray-50/70 flex items-start gap-3 relative ${
                item.unread ? "bg-[#F9FBFA]" : "bg-white"
              }`}
            >
              {getIcon(item.type)}

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-[12.5px] font-semibold text-gray-900 leading-tight truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] text-gray-400 font-normal">{item.time}</span>
                    {item.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                    )}
                  </div>
                </div>
                <p className="text-[11.5px] text-gray-500 leading-snug line-clamp-2">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="py-2.5 px-4 text-center border-t border-gray-100 bg-[#FAFAFA]">
          <Link
            href="/notifications"
            onClick={() => {
              onClose();
              if (onViewAll) onViewAll();
            }}
            className="text-[12px] font-semibold text-[#10B981] hover:text-[#059669] hover:underline transition-colors block w-full py-0.5"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
