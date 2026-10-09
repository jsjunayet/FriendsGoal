"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  INotification,
} from "@/lib/notificationApi";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

  // 1. Initial & Refresh fetch
  const refetch = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetchMyNotifications(1, 20);
      const items = res.data || [];
      setNotifications(items);
      const count =
        typeof res.unreadCount === "number"
          ? res.unreadCount
          : items.filter((n) => !n.isRead).length;
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // 2. Real-time Socket.io Listener
  useEffect(() => {
    if (!user) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Join individual user room for personalized notifications & due alerts
      if (user.userId) {
        socket.emit("join-room", user.userId);
        socket.emit("join_room", user.userId);
      }
      // Join admin room if administrator
      const roleStr = String(user.role).toLowerCase();
      if (roleStr.includes("admin") || roleStr.includes("manager")) {
        socket.emit("join-room", "admin-room");
        socket.emit("join_room", "admin-room");
      }
    });

    // Handle new incoming notifications
    const handleNewNotification = (data: INotification) => {
      setNotifications((prev) => {
        // Prevent duplicate addition
        if (prev.some((item) => item._id === data._id)) return prev;
        return [data, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("new-notification", handleNewNotification);

    // Handle single notification marked as read
    socket.on("notification_read", (payload: { notificationId: string; unreadCount?: number }) => {
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === payload.notificationId ? { ...item, isRead: true } : item
        )
      );
      if (typeof payload.unreadCount === "number") {
        setUnreadCount(payload.unreadCount);
      } else {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    // Handle bulk or server-calculated unread count updates
    socket.on("unread_count_updated", (payload: { unreadCount: number }) => {
      if (typeof payload.unreadCount === "number") {
        setUnreadCount(payload.unreadCount);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // 3. Mark Single Notification As Read
  const markAsRead = useCallback(async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await markNotificationAsRead(id);
      if (typeof res?.unreadCount === "number") {
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error("Failed to mark notification as read in DB:", err);
    }
  }, []);

  // 4. Mark All Notifications As Read
  const markAllAsRead = useCallback(async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read in DB:", err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}
