const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IGoogleFormItem {
  _id: string;
  title: string;
  embedUrl: string;
  rawInput?: string;
  description?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateGoogleFormPayload {
  title: string;
  embedUrl: string;
  description?: string;
  status?: "Active" | "Inactive";
}

export function cleanGoogleFormEmbedUrl(input: string): string {
  if (!input) return "";
  let trimmed = input.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1].trim();
  }
  if (trimmed.includes("docs.google.com/forms")) {
    trimmed = trimmed.replace(/\/edit(\?[^#]*)?(#.*)?$/i, "/viewform");
    trimmed = trimmed.replace(/\/edit\/.*$/i, "/viewform");
    trimmed = trimmed.replace(/([?&])edit_requested=[^&]*(&|$)/i, "$1").replace(/[?&]$/, "");
    if (!trimmed.includes("/viewform")) {
      trimmed = trimmed.replace(/\/+$/, "") + "/viewform";
    }
    if (!trimmed.includes("embedded=true")) {
      trimmed = `${trimmed}${trimmed.includes("?") ? "&" : "?"}embedded=true`;
    }
    return trimmed;
  }
  if (trimmed.includes("forms.gle")) {
    if (!trimmed.includes("embedded=true")) {
      trimmed = `${trimmed}${trimmed.includes("?") ? "&" : "?"}embedded=true`;
    }
    return trimmed;
  }
  return trimmed;
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

export async function fetchGoogleFormsApi(params?: {
  search?: string;
  status?: string;
}): Promise<IGoogleFormItem[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "All") {
    query.append("status", params.status);
  }
  if (params?.search) query.append("search", params.search);

  const res = await fetch(`${BASE_URL}/google-forms?${query.toString()}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch Google forms");
  }
  return json.data || [];
}

export async function fetchGoogleFormByIdApi(
  id: string
): Promise<IGoogleFormItem> {
  const res = await fetch(`${BASE_URL}/google-forms/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch Google form");
  }
  return json.data;
}

export async function createGoogleFormApi(
  payload: ICreateGoogleFormPayload
): Promise<IGoogleFormItem> {
  const res = await fetch(`${BASE_URL}/google-forms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to create Google form");
  }
  return json.data;
}

export async function updateGoogleFormApi(
  id: string,
  payload: Partial<ICreateGoogleFormPayload>
): Promise<IGoogleFormItem> {
  const res = await fetch(`${BASE_URL}/google-forms/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to update Google form");
  }
  return json.data;
}

export async function deleteGoogleFormApi(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/google-forms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to delete Google form");
  }
  return true;
}
