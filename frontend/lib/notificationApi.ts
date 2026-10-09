const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("fg_access_token") ||
    localStorage.getItem("fg_access_token") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken") ||
    ""
  );
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  requiresAction: boolean;
  isAcknowledged: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface INotificationsResponse {
  success: boolean;
  message: string;
  data: INotification[];
  unreadCount?: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    unreadCount?: number;
  };
}

export const fetchMyNotifications = async (page = 1, limit = 10): Promise<INotificationsResponse> => {
  const token = getAuthToken();
  const emptyFallback: INotificationsResponse = {
    success: true,
    message: "Empty notifications",
    data: [],
    unreadCount: 0,
    meta: { page: 1, limit, total: 0, totalPage: 1, unreadCount: 0 },
  };

  if (!token) return emptyFallback;

  try {
    const res = await fetch(`${BASE_URL}/notifications/me?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
      credentials: "include",
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      return emptyFallback;
    }

    if (!res.ok) {
      return emptyFallback;
    }

    return await res.json();
  } catch (err) {
    console.warn("fetchMyNotifications network warning:", err);
    return emptyFallback;
  }
};

export const fetchPendingPopups = async (): Promise<INotification[]> => {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BASE_URL}/notifications/me/pending-popups`, {
      headers: getHeaders(),
      credentials: "include",
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      // Unauthenticated or token expired — safely return empty array
      return [];
    }

    if (!res.ok) {
      console.warn("fetchPendingPopups returned status:", res.status);
      return [];
    }

    const data = await res.json();
    return (data.data || []) as INotification[];
  } catch (err) {
    console.warn("fetchPendingPopups error (safe fallback):", err);
    return [];
  }
};

export const markNotificationAsRead = async (id: string): Promise<{ success: boolean; data: INotification; unreadCount: number }> => {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }
  return res.json();
};

export const markAllNotificationsAsRead = async (): Promise<{ success: boolean; unreadCount: number }> => {
  const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
  return res.json();
};

export const acknowledgeNotification = async (id: string): Promise<any> => {
  const res = await fetch(`${BASE_URL}/notifications/${id}/acknowledge`, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("acknowledgeNotification failed:", res.status, errText);
    throw new Error("Failed to acknowledge notification");
  }
  return res.json();
};

export const sendDirectNotification = async (payload: {
  recipientIds: string[];
  title: string;
  message: string;
  channel: string[];
  requiresAction: boolean;
}): Promise<any> => {
  const res = await fetch(`${BASE_URL}/admin/notifications/send-direct`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send notification");
  return res.json();
};
