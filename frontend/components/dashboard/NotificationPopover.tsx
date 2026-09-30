"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

import { io } from "socket.io-client";
import { fetchMyNotifications, INotification, acknowledgeNotification } from "@/lib/notificationApi";

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

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export function NotificationPopover({ isOpen, onClose, onViewAll }: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMyNotifications(1, 10).then(res => {
        setNotifications(res.data);
      }).finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    // Socket real-time logic
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
    const socket = io(socketUrl);

    socket.on("connect", () => {
      socket.emit("join-room", "admin-room"); 
      // Should also join user-specific room if not admin, but admin-room for now
    });

    socket.on("new-notification", (data: INotification) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    // Acknowledge all locally for UX, ideally API call
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "WITHDRAWAL_REQUEST":
        return (
          <div className="w-6 h-6 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      case "DEPOSIT_SUCCESS":
      case "DUE_ALERT":
        return (
          <div className="w-6 h-6 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      case "SUPERADMIN_SECURITY_ALERT":
        return (
          <div className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center flex-shrink-0">
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
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No new notifications</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className={`p-3.5 transition-colors hover:bg-gray-50/70 flex items-start gap-3 relative ${
                  !item.isRead ? "bg-[#F9FBFA]" : "bg-white"
                }`}
              >
                {getIcon(item.type)}

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-[12.5px] font-semibold text-gray-900 leading-tight truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[11px] text-gray-400 font-normal">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-[11.5px] text-gray-500 leading-snug line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </div>
              </div>
            ))
          )}
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
