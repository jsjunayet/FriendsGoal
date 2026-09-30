/**
 * API client for Friends Goal backend.
 *
 * Base URL is read from NEXT_PUBLIC_API_URL (set in .env.local).
 * Falls back to http://localhost:5000/api for local development.
 *
 * All helpers throw an ApiError on non-2xx responses so callers
 * can catch specific HTTP status codes.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
    credentials: "include", // send HttpOnly refreshToken cookie automatically
    headers: mergedHeaders,
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      (body as { message?: string })?.message ??
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return (body as { data: T }).data;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export interface LoginPayload {
  id: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  needsPasswordChange: boolean;
}

/** POST /auth/login */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ForgotPasswordPayload {
  id: string;
}

/** POST /auth/forget-password */
export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
): Promise<void> {
  return request<void>("/auth/forget-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ResetPasswordPayload {
  id: string;
  newPassword: string;
}

/**
 * POST /auth/reset-password
 * The backend expects the reset token as the Authorization header value.
 */
export async function resetPasswordApi(
  payload: ResetPasswordPayload,
  resetToken: string,
): Promise<void> {
  return request<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { Authorization: resetToken },
  });
}

/** POST /auth/refresh-token — uses the HttpOnly cookie automatically */
export async function refreshTokenApi(): Promise<{ accessToken: string }> {
  return request<{ accessToken: string }>("/auth/refresh-token", {
    method: "POST",
  });
}

// ─── User / Member endpoints ──────────────────────────────────────────────────

export interface Member {
  _id: string;
  id: string;
  email: string;
  role: "superAdmin" | "admin" | "member";
  status: "active" | "blocked";
  isDeleted: boolean;
  needsPasswordChange: boolean;
  memberId?: string;
  name?: string;
  location?: string;
  dob?: string;
  bloodGroup?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberPayload {
  id: string;
  email: string;
  password: string;
  memberId: string;
  name: string;
  location?: string;
  dob?: string;
  bloodGroup?: string;
  image?: string;
}

export interface CreateAdminPayload {
  id: string;
  email: string;
  password: string;
}

export interface UpdateMemberPayload {
  name?: string;
  location?: string;
  dob?: string;
  bloodGroup?: string;
  image?: string;
  status?: "active" | "blocked";
}

function authHeaders(token: string) {
  return { Authorization: `${token}` };
}

/** GET /users — returns all users visible to the caller's role */
export async function getMembersApi(token: string): Promise<Member[]> {
  return request<Member[]>("/users", {
    headers: authHeaders(token),
  });
}

/** POST /users/create-member */
export async function createMemberApi(
  token: string,
  payload: CreateMemberPayload,
): Promise<Member> {
  return request<Member>("/users/create-member", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}

/** POST /users/create-admin (superAdmin only) */
export async function createAdminApi(
  token: string,
  payload: CreateAdminPayload,
): Promise<Member> {
  return request<Member>("/users/create-admin", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}

/** PATCH /users/:id */
export async function updateMemberApi(
  token: string,
  id: string,
  payload: UpdateMemberPayload,
): Promise<Member> {
  return request<Member>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}

/** DELETE /users/:id */
export async function deleteMemberApi(
  token: string,
  id: string,
): Promise<void> {
  return request<void>(`/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
