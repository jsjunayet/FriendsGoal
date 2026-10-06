import { ApiError } from "./api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export interface IBilingualField {
  bn: string;
  en: string;
}

export interface IAgendaItemPayload {
  num?: number;
  title: IBilingualField;
  text: IBilingualField;
}

export interface NoticeItem {
  _id: string;
  category?: IBilingualField;
  title: IBilingualField;
  description: IBilingualField;
  content: IBilingualField;
  images: string[];
  publishedDate?: string;
  isTickerActive: boolean;
  author: string;
  slug?: string;
  agendaHighlights?: IAgendaItemPayload[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticePayload {
  category?: IBilingualField;
  title: IBilingualField;
  description: IBilingualField;
  content: IBilingualField;
  images?: string[];
  publishedDate?: string;
  isTickerActive?: boolean;
  author?: string;
  slug?: string;
  agendaHighlights?: IAgendaItemPayload[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let token = null;
  try {
    token =
      sessionStorage.getItem("fg_access_token") ||
      localStorage.getItem("fg_access_token") ||
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
  } catch (e) {}

  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: mergedHeaders,
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = body?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return body?.data ?? body;
}

export async function getNoticesApi(): Promise<NoticeItem[]> {
  return request<NoticeItem[]>("/notices");
}

export async function getTickerNoticesApi(): Promise<NoticeItem[]> {
  return request<NoticeItem[]>("/notices/ticker");
}

export async function getSingleNoticeApi(idOrSlug: string): Promise<NoticeItem> {
  return request<NoticeItem>(`/notices/${idOrSlug}`);
}

export async function createNoticeApi(payload: CreateNoticePayload): Promise<NoticeItem> {
  return request<NoticeItem>("/notices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNoticeApi(
  id: string,
  payload: Partial<CreateNoticePayload>
): Promise<NoticeItem> {
  return request<NoticeItem>(`/notices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteNoticeApi(id: string): Promise<void> {
  return request<void>(`/notices/${id}`, {
    method: "DELETE",
  });
}
