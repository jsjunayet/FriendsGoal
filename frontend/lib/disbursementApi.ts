export interface IDisbursementRecord {
  _id: string;
  disbursementId: string;
  numericId: number;
  memberId: string;
  memberName: string;
  memberCode?: string;
  disbursedAmount: number;
  disbursDate: string;
  remarks?: string;
  createdAt?: string;
}

export interface ICreateDisbursementPayload {
  memberId: string;
  paidAmount: number;
  disbursDate?: string;
  remarks?: string;
}

export interface IDisbursementFilterParams {
  fromDate?: string;
  toDate?: string;
  memberId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IDisbursementListResponse {
  data: IDisbursementRecord[];
  meta: TMeta;
}

export interface IMemberProfitResponse {
  memberId: string;
  memberName: string;
  memberCode?: string;
  profitBalance: number;
  totalDeposit?: number;
  dueAmount?: number;
}

export interface ICreateWithdrawalPayload {
  memberId: string;
  amount: number;
  payoutMethod?: string;
  accountNumber?: string;
  reason?: string;
}

export interface IWithdrawalResponse {
  withdrawal: {
    _id: string;
    referenceId: string;
    memberId: string;
    memberName: string;
    amount: number;
    availableProfitBefore: number;
    status: string;
    createdAt: string;
  };
  remainingProfitBalance: number;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export const INITIAL_DISBURSEMENTS: IDisbursementRecord[] = [];

let inMemoryDisbursements: IDisbursementRecord[] = [];

// Mock profit balances mapped by member
const inMemoryProfitBalances: Record<string, number> = {};

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
 * 1. GET /api/v1/members/:memberId/profit-balance
 */
export async function fetchMemberProfitBalanceApi(
  memberId: string
): Promise<IMemberProfitResponse> {
  const cleanId = memberId ? memberId.trim() : "";
  if (!cleanId) {
    return {
      memberId: "",
      memberName: "",
      profitBalance: 0,
      totalDeposit: 0,
    };
  }

  try {
    let res = await fetch(`${BASE_URL}/disbursements/member/${encodeURIComponent(cleanId)}/profit-balance`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${BASE_URL}/members/${encodeURIComponent(cleanId)}/profit-balance`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
    }

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          memberId: json.data.memberId || cleanId,
          memberName: json.data.memberName || json.data.fullName || cleanId,
          profitBalance: Number(json.data.profitBalance) || 0,
          totalDeposit: Number(json.data.totalDeposit) || 0,
        };
      }
    }
  } catch (err) {
    console.warn("Backend /members/:id/profit-balance failed", err);
  }

  const profit = inMemoryProfitBalances[cleanId] ?? 0;
  return {
    memberId: cleanId,
    memberName: cleanId,
    profitBalance: profit,
    totalDeposit: 0,
  };
}

/**
 * 2. GET /api/v1/disbursements
 */
export async function fetchDisbursementsApi(
  filters: IDisbursementFilterParams = {}
): Promise<IDisbursementListResponse> {
  const query = new URLSearchParams();
  if (filters.fromDate) query.append("fromDate", filters.fromDate);
  if (filters.toDate) query.append("toDate", filters.toDate);
  if (filters.memberId) query.append("memberId", filters.memberId);
  if (filters.search) query.append("search", filters.search);
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  try {
    const res = await fetch(`${BASE_URL}/disbursements?${query.toString()}`, {
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
    console.warn("Backend /disbursements failed, using client memory", err);
  }

  // Client-side fallback
  let filtered = [...inMemoryDisbursements];

  if (filters.fromDate) {
    const fromTime = new Date(filters.fromDate).getTime();
    filtered = filtered.filter((d) => new Date(d.disbursDate).getTime() >= fromTime);
  }
  if (filters.toDate) {
    const toTime = new Date(filters.toDate).getTime();
    filtered = filtered.filter((d) => new Date(d.disbursDate).getTime() <= toTime);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.memberName.toLowerCase().includes(term) ||
        d.disbursementId.toLowerCase().includes(term) ||
        String(d.disbursedAmount).includes(term)
    );
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
 * 3. POST /api/v1/disbursements
 */
export async function createDisbursementApi(
  payload: ICreateDisbursementPayload
): Promise<IDisbursementRecord> {
  try {
    const res = await fetch(`${BASE_URL}/disbursements`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        inMemoryDisbursements.unshift(json.data);
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
    console.warn("Backend create disbursement failed, fallback to client memory", err);
  }

  // Fallback client creation
  const nextNum =
    inMemoryDisbursements.length > 0
      ? Math.max(...inMemoryDisbursements.map((d) => d.numericId)) + 1
      : 101;
  const disbursementId = String(nextNum);

  const newRecord: IDisbursementRecord = {
    _id: `disb-${Date.now()}`,
    disbursementId,
    numericId: nextNum,
    memberId: payload.memberId,
    memberName: payload.memberId,
    disbursedAmount: Number(payload.paidAmount),
    disbursDate: payload.disbursDate || new Date().toISOString().slice(0, 10),
    remarks: payload.remarks || "Profit Distribution",
    createdAt: new Date().toISOString(),
  };

  inMemoryDisbursements.unshift(newRecord);
  return newRecord;
}

/**
 * 4. POST /api/v1/withdrawals
 */
export async function createWithdrawalRequestApi(
  payload: ICreateWithdrawalPayload
): Promise<IWithdrawalResponse> {
  try {
    const res = await fetch(`${BASE_URL}/withdrawals`, {
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
    const errJson = await res.json().catch(() => null);
    if (errJson && errJson.message) {
      throw new Error(errJson.message);
    }
    throw new Error(`Withdrawal request failed with status ${res.status}`);
  } catch (err: any) {
    throw err;
  }
}
