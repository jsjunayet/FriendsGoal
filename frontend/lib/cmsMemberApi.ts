import { ApiError } from "./api";
import type { IBilingualField } from "./noticeApi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export interface CMSMemberItem {
  _id: string;
  memberId?: string;
  memberCode?: string;
  fullName: string;
  name?: IBilingualField;
  designation: string;
  designationBn: string;
  roleTitle?: IBilingualField;
  councilCategory: string;
  councilType?: string;
  email?: string;
  mobileNo?: string;
  phone?: string;
  district?: string;
  bloodGroup?: string;
  photoUrl?: string;
  pictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCMSMemberPayload {
  memberId?: string;
  fullName?: string;
  name?: IBilingualField;
  email?: string;
  mobileNo?: string;
  phone?: string;
  designation?: string;
  designationBn?: string;
  roleTitle?: IBilingualField;
  councilCategory?: string;
  councilType?: string;
  district?: string;
  bloodGroup?: string;
  photoUrl?: string;
  pictureUrl?: string;
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

export async function getPublicMembersApi(councilType?: string): Promise<CMSMemberItem[]> {
  const query = councilType ? `?councilType=${encodeURIComponent(councilType)}` : "";
  return request<CMSMemberItem[]>(`/members/public-council${query}`);
}

export async function createCMSMemberApi(payload: CreateCMSMemberPayload): Promise<CMSMemberItem> {
  // Ensure required fields like fullName, email, mobileNo are populated if missing
  const fullPayload = {
    fullName: payload.name?.en || payload.name?.bn || payload.fullName || "Member",
    email: payload.email || `member_${Date.now()}@friendsgoal.org`,
    mobileNo: payload.mobileNo || payload.phone || "+8801700000000",
    ...payload,
  };
  return request<CMSMemberItem>("/members", {
    method: "POST",
    body: JSON.stringify(fullPayload),
  });
}

export async function updateCMSMemberApi(
  id: string,
  payload: Partial<CreateCMSMemberPayload>
): Promise<CMSMemberItem> {
  return request<CMSMemberItem>(`/members/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCMSMemberApi(id: string): Promise<void> {
  return request<void>(`/members/${id}`, {
    method: "DELETE",
  });
}
