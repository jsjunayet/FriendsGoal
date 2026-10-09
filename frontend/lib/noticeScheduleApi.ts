const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type NoticeScheduleType =
  | "Fee Reminder"
  | "Important Notice"
  | "Invitation"
  | "Meeting";

export type NoticeAudience =
  | "All members"
  | "Active members"
  | "Due members"
  | "Specific member";

export interface INoticeScheduleItem {
  _id: string;
  type: NoticeScheduleType;
  title: string;
  message?: string;
  audience: NoticeAudience;
  status: "Published" | "Draft" | "Archived";
  targetMemberId?: string;
  targetMemberName?: string;
  targetMemberCode?: string;
  dueDate?: string;
  feeAmount?: number;
  feeCurrency?: string;
  paymentStatus?: string;
  eventDate?: string;
  time?: string;
  location?: string;
  agenda?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateNoticeSchedulePayload {
  type: NoticeScheduleType;
  title: string;
  message?: string;
  audience: NoticeAudience;
  status?: "Published" | "Draft" | "Archived";
  targetMemberId?: string;
  targetMemberName?: string;
  targetMemberCode?: string;
  dueDate?: string;
  feeAmount?: number;
  feeCurrency?: string;
  paymentStatus?: string;
  eventDate?: string;
  time?: string;
  location?: string;
  agenda?: string;
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token =
      sessionStorage.getItem("fg_access_token") ||
      localStorage.getItem("fg_access_token") ||
      sessionStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function fetchNoticeSchedulesApi(params?: {
  type?: string;
  search?: string;
  audience?: string;
  memberId?: string;
}): Promise<INoticeScheduleItem[]> {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "All" && params.type !== "All types") {
    query.append("type", params.type);
  }
  if (params?.search) query.append("search", params.search);
  if (params?.audience && params.audience !== "All") {
    query.append("audience", params.audience);
  }
  if (params?.memberId) {
    query.append("memberId", params.memberId);
  }

  const res = await fetch(`${BASE_URL}/notice-schedules?${query.toString()}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch notice schedules");
  }
  return json.data || [];
}

export async function fetchNoticeScheduleByIdApi(
  id: string
): Promise<INoticeScheduleItem> {
  const res = await fetch(`${BASE_URL}/notice-schedules/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch notice schedule");
  }
  return json.data;
}

export async function createNoticeScheduleApi(
  payload: ICreateNoticeSchedulePayload
): Promise<INoticeScheduleItem> {
  const res = await fetch(`${BASE_URL}/notice-schedules`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to publish notice schedule");
  }
  return json.data;
}

export async function updateNoticeScheduleApi(
  id: string,
  payload: Partial<ICreateNoticeSchedulePayload>
): Promise<INoticeScheduleItem> {
  const res = await fetch(`${BASE_URL}/notice-schedules/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to update notice schedule");
  }
  return json.data;
}

export async function deleteNoticeScheduleApi(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/notice-schedules/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to delete notice schedule");
  }
  return true;
}
