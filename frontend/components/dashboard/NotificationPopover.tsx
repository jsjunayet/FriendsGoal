"use client";

import Link from "next/link";
import { Check, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { INotification } from "@/lib/notificationApi";
import { useNotifications } from "@/lib/hooks/useNotifications";

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

export interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
  notifications?: INotification[];
  unreadCount?: number;
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationPopover({
  isOpen,
  onClose,
  onViewAll,
  notifications: propsNotifications,
  unreadCount: propsUnreadCount,
  isLoading: propsIsLoading,
  onMarkAsRead: propsOnMarkAsRead,
  onMarkAllAsRead: propsOnMarkAllAsRead,
}: NotificationPopoverProps) {
  const internalHook = useNotifications();

  if (!isOpen) return null;

  const notifications = propsNotifications ?? internalHook.notifications;
  const unreadCount = propsUnreadCount ?? internalHook.unreadCount;
  const isLoading = propsIsLoading ?? internalHook.isLoading;
  const onMarkAsRead = propsOnMarkAsRead ?? internalHook.markAsRead;
  const onMarkAllAsRead = propsOnMarkAllAsRead ?? internalHook.markAllAsRead;

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
          <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
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
          <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <>
      {/* Click-away backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover container */}
      <div className="absolute right-0 top-12 z-50 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-gray-900">Notifications</span>
            {unreadCount > 0 ? (
              <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {unreadCount} unread
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                All caught up
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[12px] font-medium text-[#10B981] hover:text-[#059669] hover:underline transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List items */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No notifications yet</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  if (!item.isRead) {
                    onMarkAsRead(item._id);
                  }
                }}
                className={`p-3.5 transition-colors flex items-start gap-3 relative cursor-pointer ${
                  !item.isRead
                    ? "bg-[#F4FBF7] hover:bg-[#EBF7F1] border-l-3 border-l-[#10B981]"
                    : "bg-white hover:bg-gray-50/70 opacity-80"
                }`}
              >
                {getIcon(item.type)}

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`text-[12.5px] leading-tight truncate ${
                        !item.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[11px] text-gray-400 font-normal">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <div
                    className="text-[11.5px] text-gray-600 leading-snug line-clamp-2"
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
