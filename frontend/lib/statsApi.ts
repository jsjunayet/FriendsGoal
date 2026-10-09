import { ApiError } from "./api";
import type { IBilingualField } from "./noticeApi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export interface StatCounterItem {
  _id: string;
  key: string;
  label: IBilingualField;
  value: string;
  order?: number;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let token = null;
  try {
    token = sessionStorage.getItem("fg_access_token");
  } catch (e) {}

  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function getStatsApi(): Promise<StatCounterItem[]> {
  return request<StatCounterItem[]>("/stats");
}

export async function updateStatApi(
  id: string,
  payload: Partial<StatCounterItem>
): Promise<StatCounterItem> {
  return request<StatCounterItem>(`/stats/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function bulkUpdateStatsApi(
  payload:
    | Array<{ key: string; value: string; label?: IBilingualField; order?: number }>
    | Record<string, any>
): Promise<StatCounterItem[]> {
  return request<StatCounterItem[]>("/stats/bulk", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
