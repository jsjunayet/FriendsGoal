import { ApiError } from "./api";
import type { IBilingualField } from "./noticeApi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export interface GalleryItem {
  _id: string;
  title: IBilingualField;
  subtitle?: IBilingualField;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryPayload {
  title: IBilingualField;
  subtitle?: IBilingualField;
  images: string[];
  category: string;
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

export async function getGalleryItemsApi(category?: string): Promise<GalleryItem[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request<GalleryItem[]>(`/gallery${query}`);
}

export async function createGalleryItemApi(payload: CreateGalleryPayload): Promise<GalleryItem> {
  return request<GalleryItem>("/gallery", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGalleryItemApi(
  id: string,
  payload: Partial<CreateGalleryPayload>
): Promise<GalleryItem> {
  return request<GalleryItem>(`/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteGalleryItemApi(id: string): Promise<void> {
  return request<void>(`/gallery/${id}`, {
    method: "DELETE",
  });
}
