import { ApiError } from "./api";
import type { IBilingualField } from "./noticeApi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export interface MarqueeItem {
  _id: string;
  headline?: IBilingualField;
  text?: IBilingualField;
  targetLink?: string;
  link?: string;
  isActive: boolean;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarqueePayload {
  headline?: IBilingualField;
  text?: IBilingualField;
  targetLink?: string;
  link?: string;
  isActive?: boolean;
  priority?: number;
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
    let message = body?.message;
    if (body?.errorSources && Array.isArray(body.errorSources) && body.errorSources.length > 0) {
      const details = body.errorSources.map((es: any) => es.message).filter(Boolean);
      if (details.length > 0) {
        if (!message || message === "Validation Error" || message === "Something went wrong") {
          message = details.join(". ");
        } else if (!details.includes(message)) {
          message = `${message}: ${details.join(", ")}`;
        }
      }
    }
    message = message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return body?.data ?? body;
}

/**
 * Public API: Fetch active marquee items for Home Page (GET /api/v1/marquee/active)
 */
export async function getActiveMarqueeItemsApi(): Promise<MarqueeItem[]> {
  return request<MarqueeItem[]>("/marquee/active");
}

/**
 * Fetch marquee items. If onlyActive is true, fetches /marquee/active, else fetches /marquee (Admin).
 */
export async function getMarqueeItemsApi(onlyActive = false): Promise<MarqueeItem[]> {
  if (onlyActive) {
    return getActiveMarqueeItemsApi();
  }
  return request<MarqueeItem[]>("/marquee");
}

export async function createMarqueeItemApi(payload: CreateMarqueePayload): Promise<MarqueeItem> {
  return request<MarqueeItem>("/marquee", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMarqueeItemApi(
  id: string,
  payload: Partial<CreateMarqueePayload>
): Promise<MarqueeItem> {
  return request<MarqueeItem>(`/marquee/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteMarqueeItemApi(id: string): Promise<void> {
  return request<void>(`/marquee/${id}`, {
    method: "DELETE",
  });
}
