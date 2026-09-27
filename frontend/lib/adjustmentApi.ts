export type TAdjustmentType = "credit" | "debit" | "fee_reversal" | "operational";

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
  adjustmentType: "credit" | "debit" | "fee_reversal" | "operational";
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
export const INITIAL_MOCK_ADJUSTMENTS: IAdjustmentRecord[] = [
  {
    _id: "adj-130",
    adjustmentId: "130",
    memberId: "mem-130",
    memberCode: "130",
    memberName: "MD MAFUF HOSSAIN",
    adjustmentType: "debit",
    adjustmentTypeName: "Balance Adjustment",
    adjustmentDate: "2026-07-17",
    adjustmentAmount: 1000,
    signedAmount: -1000,
    previousBalance: { totalDeposit: 25000, savingsBalance: 1000, dueAmount: 0 },
    updatedBalance: { totalDeposit: 24000, savingsBalance: 0, dueAmount: 0 },
    remarks: "__Balance Adjustment _ Double input",
  },
  {
    _id: "adj-131",
    adjustmentId: "131",
    memberId: "mem-131",
    memberCode: "131",
    memberName: "SARAH JENKINS",
    adjustmentType: "fee_reversal",
    adjustmentTypeName: "Fee Reversal",
    adjustmentDate: "2026-07-18",
    adjustmentAmount: 150,
    signedAmount: 150,
    previousBalance: { totalDeposit: 15000, savingsBalance: 0, dueAmount: 150 },
    updatedBalance: { totalDeposit: 15000, savingsBalance: 0, dueAmount: 0 },
    remarks: "Waived late fee per CS request",
  },
  {
    _id: "adj-132",
    adjustmentId: "132",
    memberId: "mem-132",
    memberCode: "132",
    memberName: "JOHN DOE",
    adjustmentType: "debit",
    adjustmentTypeName: "Balance Adjustment",
    adjustmentDate: "2026-07-19",
    adjustmentAmount: 50,
    signedAmount: -50,
    previousBalance: { totalDeposit: 10000, savingsBalance: 50, dueAmount: 0 },
    updatedBalance: { totalDeposit: 9950, savingsBalance: 0, dueAmount: 0 },
    remarks: "Correction for overpayment",
  },
];

// In-memory cache for optimistic state during session
let inMemoryAdjustments = [...INITIAL_MOCK_ADJUSTMENTS];

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
