const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("fg_access_token") || "";
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
  createdAt: string;
}

export const fetchMyNotifications = async (page = 1, limit = 10) => {
  const token = getAuthToken();
  if (!token) return { data: [], meta: { page: 1, limit: 10, total: 0 } };

  const res = await fetch(`${BASE_URL}/notifications/me?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const fetchPendingPopups = async () => {
  const token = getAuthToken();
  if (!token) return [];

  const res = await fetch(`${BASE_URL}/notifications/me/pending-popups`, {
    headers: getHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error("fetchPendingPopups Error Status:", res.status, errorBody);
    throw new Error(`Failed to fetch popups. Status: ${res.status}. Body: ${errorBody}`);
  }
  const data = await res.json();
  return data.data as INotification[];
};

export const acknowledgeNotification = async (id: string) => {
  console.log("acknowledgeNotification called with ID:", id);
  const res = await fetch(`${BASE_URL}/notifications/${id}/acknowledge`, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: "include",
  });
  console.log("acknowledgeNotification response status:", res.status);
  if (!res.ok) {
    const errText = await res.text();
    console.error("acknowledgeNotification failed:", res.status, errText);
    throw new Error("Failed to acknowledge notification");
  }
  return res.json();
};

export const sendDirectNotification = async (payload: { recipientIds: string[], title: string, message: string, channel: string[], requiresAction: boolean }) => {
  const res = await fetch(`${BASE_URL}/admin/notifications/send-direct`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send notification");
  return res.json();
};
