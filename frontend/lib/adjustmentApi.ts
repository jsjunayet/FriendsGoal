export type TAdjustmentType = "ADD" | "SUB" | "OTHER_RECEIVED";

export interface IAdjustmentRecord {
  _id: string;
  adjustmentId: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  adjustmentType: TAdjustmentType;
  adjustmentTypeName: string;
  adjustmentDate: string;
  adjustmentAmount: number;
  signedAmount: number;
  previousBalance: {
    totalDeposit: number;
    savingsBalance: number;
    dueAmount: number;
  };
  updatedBalance: {
    totalDeposit: number;
    savingsBalance: number;
    dueAmount: number;
  };
  remarks: string;
  createdAt?: string;
}

export interface ICreateAdjustmentPayload {
  memberId: string;
  adjustmentType: TAdjustmentType | "credit" | "debit" | "fee_reversal" | "operational";
  adjustmentDate?: string;
  adjustmentAmount: number;
  remarks: string;
}

export interface IAdjustmentFilterParams {
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  adjustmentType?: string;
  page?: number;
  limit?: number;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IAdjustmentListResponse {
  data: IAdjustmentRecord[];
  meta: TMeta;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Initial Mock Adjustments matching Screenshot 2 ──────────────────────────
export const INITIAL_MOCK_ADJUSTMENTS: IAdjustmentRecord[] = [];

let inMemoryAdjustments: IAdjustmentRecord[] = [];

/**
 * 1. GET /api/v1/adjustments
 */
export async function fetchAdjustmentsApi(
  filters: IAdjustmentFilterParams = {}
): Promise<IAdjustmentListResponse> {
  const query = new URLSearchParams();
  if (filters.fromDate) query.append("fromDate", filters.fromDate);
  if (filters.toDate) query.append("toDate", filters.toDate);
  if (filters.searchTerm) query.append("searchTerm", filters.searchTerm);
  if (filters.adjustmentType) query.append("adjustmentType", filters.adjustmentType);
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  try {
    const res = await fetch(`${BASE_URL}/adjustments?${query.toString()}`, {
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
    console.warn("Backend /adjustments failed, using fallback dataset", err);
  }

  // Client-side fallback for offline/development
  let filtered = [...inMemoryAdjustments];

  if (filters.fromDate) {
    const fromTime = new Date(filters.fromDate).getTime();
    filtered = filtered.filter((a) => new Date(a.adjustmentDate).getTime() >= fromTime);
  }
  if (filters.toDate) {
    const toTime = new Date(filters.toDate).getTime();
    filtered = filtered.filter((a) => new Date(a.adjustmentDate).getTime() <= toTime);
  }
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.memberName.toLowerCase().includes(term) ||
        a.memberCode.toLowerCase().includes(term) ||
        a.adjustmentId.toLowerCase().includes(term) ||
        a.remarks.toLowerCase().includes(term)
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
 * 2. POST /api/v1/adjustments
 */
export async function createAdjustmentApi(
  payload: ICreateAdjustmentPayload
): Promise<IAdjustmentRecord> {
  const res = await fetch(`${BASE_URL}/adjustments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const json = await res.json();
    if (json.success && json.data) {
      inMemoryAdjustments = [json.data, ...inMemoryAdjustments];
      return json.data;
    }
  }

  const errJson = await res.json().catch(() => null);
  const errMsg =
    errJson?.message ||
    errJson?.errorSources?.[0]?.message ||
    "Failed to create adjustment";
  throw new Error(errMsg);
}

/**
 * 3. GET /api/v1/adjustments/:id
 */
export async function fetchAdjustmentByIdApi(id: string): Promise<IAdjustmentRecord> {
  try {
    const res = await fetch(`${BASE_URL}/adjustments/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (err) {
    console.warn("Backend /adjustments/:id failed, fallback", err);
  }

  const found = inMemoryAdjustments.find((a) => a.adjustmentId === id || a._id === id);
  if (!found) throw new Error("Adjustment record not found");
  return found;
}
