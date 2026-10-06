export interface IMember {
  _id: string;
  memberCode: string;
  fullName: string;
  email: string;
  bloodGroup?: string;
  profession?: string;
  nidNo?: string;
  birthRegistrationNo?: string;
  fatherName?: string;
  motherName?: string;
  mobileNo: string;
  dateOfBirth?: string;
  division?: string;
  district?: string;
  thana?: string;
  presentAddress?: string;

  designation: string;
  designationBn: string;
  councilCategory: "core_leadership" | "financial_leadership" | "general_member";

  role: "superadmin" | "admin" | "manager" | "member";
  password?: string;
  totalDeposit: number;
  savingsBalance: number;
  dueAmount: number;

  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeNid?: string;
  nomineeAddress?: string;
  nomineePictureUrl?: string;
  pictureUrl?: string;
  signatureUrl?: string;

  status: "active" | "inactive" | "blocked";
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Initial Mock Members ───────────────────────────────────────────────────

const PRIMARY_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const LOCAL_FALLBACK_URL = "http://localhost:5000/api/v1";

function getAuthHeaders(): Record<string, string> {
  let token = null;
  try {
    token = sessionStorage.getItem("fg_access_token") || localStorage.getItem("fg_access_token");
  } catch (e) {}

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

const getApiUrlsToTry = (): string[] => {
  const list = [];
  if (PRIMARY_URL) list.push(PRIMARY_URL);
  if (LOCAL_FALLBACK_URL && LOCAL_FALLBACK_URL !== PRIMARY_URL) list.push(LOCAL_FALLBACK_URL);
  return list;
};

// ─── API Client Functions ─────────────────────────────────────────────────────

export async function fetchMembersApi(params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  councilCategory?: string;
  designation?: string;
}): Promise<{ data: IMember[]; meta: TMeta }> {
  const query = new URLSearchParams();
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.councilCategory) query.append("councilCategory", params.councilCategory);
  if (params?.designation) query.append("designation", params.designation);

  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members?${query.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return {
            data: json.data,
            meta: json.meta || {
              page: params?.page || 1,
              limit: params?.limit || 10,
              total: json.data.length,
              totalPage: Math.ceil(json.data.length / (params?.limit || 10)),
            },
          };
        }
      }
    } catch (err) {
      // Continue to next URL
    }
  }

  return {
    data: [],
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: 0,
      totalPage: 1,
    },
  };
}

export async function fetchMemberByIdApi(id: string): Promise<IMember> {
  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Continue
    }
  }

  throw new Error("Member not found");
}

export async function fetchPublicCouncilApi(params?: {
  category?: string;
  designation?: string;
  search?: string;
}): Promise<IMember[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append("category", params.category);
  if (params?.designation) query.append("designation", params.designation);
  if (params?.search) query.append("search", params.search);

  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members/public-council?${query.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Continue
    }
  }

  return [];
}

export async function createMemberApi(payload: Partial<IMember>): Promise<IMember> {
  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Continue
    }
  }

  throw new Error("Failed to create member");
}

export async function updateMemberApi(id: string, payload: Partial<IMember>): Promise<IMember> {
  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Continue
    }
  }

  throw new Error("Failed to update member");
}

export async function deleteMemberApi(id: string): Promise<void> {
  const urls = getApiUrlsToTry();
  for (const url of urls) {
    try {
      const res = await fetch(`${url}/members/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        return;
      }
    } catch (err) {
      // Continue
    }
  }

  throw new Error("Failed to delete member");
}
