export type TInvestmentStatus = "Running" | "Closed";

export interface IInvestmentRecord {
  _id: string;
  investmentId: string;
  numericId: number;
  name: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  remarks: string;
  status: TInvestmentStatus;
  isActive: boolean;
  memberId?: string;
  memberName?: string;
  memberCode?: string;
  createdAt?: string;
}

export interface ICreateInvestmentPayload {
  name: string;
  amount: number;
  startDate: string;
  endDate?: string | null;
  remarks: string;
  status?: TInvestmentStatus;
  isActive?: boolean;
  memberId?: string;
  memberName?: string;
  memberCode?: string;
}

export interface IUpdateInvestmentPayload {
  name?: string;
  amount?: number;
  startDate?: string;
  endDate?: string | null;
  remarks?: string;
  status?: TInvestmentStatus;
  isActive?: boolean;
  memberId?: string;
  memberName?: string;
  memberCode?: string;
}

export interface IInvestmentFilterParams {
  search?: string;
  status?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IInvestmentListResponse {
  data: IInvestmentRecord[];
  meta: TMeta;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Initial Mock Investments matching Screenshot 1 ───────────────────────────
export const INITIAL_INVESTMENTS: IInvestmentRecord[] = [];

let inMemoryInvestments: IInvestmentRecord[] = [];

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("fg_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    }
  }
  return headers;
}

/**
 * 1. GET /api/v1/investments
 */
export async function fetchInvestmentsApi(
  filters: IInvestmentFilterParams = {}
): Promise<IInvestmentListResponse> {
  const query = new URLSearchParams();
  if (filters.search) query.append("search", filters.search);
  if (filters.status) query.append("status", filters.status);
  if (filters.isActive !== undefined) query.append("isActive", String(filters.isActive));
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  try {
    const res = await fetch(`${BASE_URL}/investments?${query.toString()}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          data: json.data,
          meta: json.meta || {
            page: filters.page || 1,
            limit: filters.limit || 10,
            total: json.data.length,
            totalPage: 1,
          },
        };
      }
    }
  } catch (err) {
    console.warn("Backend /investments failed, using client storage fallback", err);
  }

  // Client fallback
  let filtered = [...inMemoryInvestments];

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (inv) =>
        inv.name.toLowerCase().includes(term) ||
        inv.remarks.toLowerCase().includes(term) ||
        inv.investmentId.toLowerCase().includes(term) ||
        String(inv.amount).includes(term) ||
        (inv.memberName && inv.memberName.toLowerCase().includes(term))
    );
  }

  if (filters.status && filters.status !== "All") {
    filtered = filtered.filter((inv) => inv.status === filters.status);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const total = filtered.length;
  const totalPage = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;
  const data = filtered.slice(skip, skip + limit);

  return {
    data,
    meta: { page, limit, total, totalPage },
  };
}

/**
 * 2. POST /api/v1/investments
 */
export async function createInvestmentApi(
  payload: ICreateInvestmentPayload
): Promise<IInvestmentRecord> {
  try {
    const res = await fetch(`${BASE_URL}/investments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        inMemoryInvestments.push(json.data);
        return json.data;
      }
    }
    const errJson = await res.json().catch(() => null);
    let errorMsg = errJson?.message;
    if (errJson?.errorSources && Array.isArray(errJson.errorSources) && errJson.errorSources.length > 0) {
      const details = errJson.errorSources.map((es: any) => es.message).filter(Boolean);
      if (details.length > 0) {
        if (!errorMsg || errorMsg === "Validation Error" || errorMsg === "Something went wrong") {
          errorMsg = details.join(". ");
        } else if (!details.includes(errorMsg)) {
          errorMsg = `${errorMsg}: ${details.join(", ")}`;
        }
      }
    }
    throw new Error(errorMsg || `Request failed with status ${res.status}`);
  } catch (err: any) {
    if (err instanceof Error && !err.message.includes("Failed to fetch")) {
      throw err;
    }
    console.warn("Backend create investment failed, fallback to client memory", err);
  }

  // Client memory fallback
  const nextNum = inMemoryInvestments.length > 0
    ? Math.max(...inMemoryInvestments.map((i) => i.numericId)) + 1
    : 1;
  const investmentId = String(nextNum).padStart(3, "0");

  const isClosed = payload.status === "Closed" || Boolean(payload.endDate);
  const status: TInvestmentStatus = isClosed ? "Closed" : "Running";
  const isActive = isClosed ? false : (payload.isActive ?? true);

  const newRecord: IInvestmentRecord = {
    _id: `inv-${Date.now()}`,
    investmentId,
    numericId: nextNum,
    name: payload.name,
    amount: Number(payload.amount),
    startDate: payload.startDate,
    endDate: payload.endDate || null,
    remarks: payload.remarks,
    status,
    isActive,
    memberId: payload.memberId,
    memberName: payload.memberName,
    memberCode: payload.memberCode,
    createdAt: new Date().toISOString(),
  };

  inMemoryInvestments.push(newRecord);
  return newRecord;
}

/**
 * 3. PATCH /api/v1/investments/:id/close
 */
export async function closeInvestmentApi(id: string): Promise<IInvestmentRecord> {
  try {
    const res = await fetch(`${BASE_URL}/investments/${id}/close`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const idx = inMemoryInvestments.findIndex(
          (i) => i._id === id || i.investmentId === id
        );
        if (idx !== -1) {
          inMemoryInvestments[idx] = json.data;
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend close investment failed, fallback to client memory", err);
  }

  // Fallback client update
  const today = new Date().toISOString().slice(0, 10);
  const item = inMemoryInvestments.find(
    (i) => i._id === id || i.investmentId === id
  );
  if (item) {
    item.endDate = today;
    item.status = "Closed";
    item.isActive = false;
    return { ...item };
  }

  throw new Error("Investment not found");
}

/**
 * 4. PATCH /api/v1/investments/:id
 */
export async function updateInvestmentApi(
  id: string,
  payload: IUpdateInvestmentPayload
): Promise<IInvestmentRecord> {
  try {
    const res = await fetch(`${BASE_URL}/investments/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const idx = inMemoryInvestments.findIndex(
          (i) => i._id === id || i.investmentId === id
        );
        if (idx !== -1) {
          inMemoryInvestments[idx] = json.data;
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend update investment failed, fallback to client memory", err);
  }

  const idx = inMemoryInvestments.findIndex(
    (i) => i._id === id || i.investmentId === id
  );
  if (idx !== -1) {
    inMemoryInvestments[idx] = {
      ...inMemoryInvestments[idx],
      ...payload,
      amount: payload.amount !== undefined ? Number(payload.amount) : inMemoryInvestments[idx].amount,
    };
    return inMemoryInvestments[idx];
  }

  throw new Error("Investment not found");
}
