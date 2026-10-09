export interface IDueListItem {
  _id: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  mobileNo: string;
  dueAmount: number;
  advanceBalance: number;
  status: "Advance" | "Due" | "Zero";
  totalDeposit: number;
  updatedAt?: string;
}

export interface ICollectionRecord {
  _id: string;
  receiptNo: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "mobile_banking";
  paymentDate: string;
  month: string;
  note?: string;
  status: "Paid" | "Due";
}

export interface IPaymentPayload {
  memberId: string;
  amount: number;
  paymentMethod?: "cash" | "bank" | "mobile_banking";
  month?: string;
  note?: string;
}

export interface IPaymentResult {
  receiptNo: string;
  amount: number;
  memberCode: string;
  memberName: string;
  paymentDate: string;
  newDueAmount: number;
  newAdvanceBalance: number;
  newTotalDeposit: number;
  status: string;
}

export interface IDueListFilterParams {
  searchByCodeOrName?: string;
  year?: string;
  status?: "All" | "Advance" | "Due" | "Zero";
  dateRange?: string;
  page?: number;
  limit?: number;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IDueListResponse {
  data: IDueListItem[];
  meta: TMeta;
  counts: {
    total: number;
    advance: number;
    due: number;
    zero: number;
  };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export const INITIAL_RECENT_COLLECTIONS: ICollectionRecord[] = [];

export const INITIAL_MOCK_DUE_LIST: IDueListItem[] = [];

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * 1. GET /api/v1/operations/due-list
 */
export async function fetchDueListApi(
  filters: IDueListFilterParams = {}
): Promise<IDueListResponse> {
  const query = new URLSearchParams();
  if (filters.searchByCodeOrName) query.append("searchByCodeOrName", filters.searchByCodeOrName);
  if (filters.year) query.append("year", filters.year);
  if (filters.status && filters.status !== "All") query.append("status", filters.status);
  if (filters.dateRange) query.append("dateRange", filters.dateRange);
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  try {
    const res = await fetch(`${BASE_URL}/operations/due-list?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch due list");
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("Backend /operations/due-list failed, returning fallback mock dataset", err);
    // Client-side filtering fallback for demo/offline
    let filtered = [...INITIAL_MOCK_DUE_LIST];
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
    if (filters.searchByCodeOrName) {
      const q = filters.searchByCodeOrName.toLowerCase();
      filtered = filtered.filter(
        (i) => i.memberCode.toLowerCase().includes(q) || i.memberName.toLowerCase().includes(q)
      );
    }
    const page = filters.page || 1;
    const limit = filters.limit || 6;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPage: Math.ceil(filtered.length / limit) || 1,
      },
      counts: { total: 0, advance: 0, due: 0, zero: 0 },
    };
  }
}

/**
 * 2. GET /api/v1/operations/collections
 * If memberId is omitted, returns top 10 global recent transactions.
 * If memberId is provided, returns all chronological transactions and due balance for that member.
 */
export async function fetchCollectionsApi(
  memberId?: string
): Promise<{
  memberInfo?: {
    _id: string;
    memberCode: string;
    fullName: string;
    dueAmount: number;
    advanceBalance: number;
    totalDeposit: number;
  };
  dueBalance?: number;
  advanceBalance?: number;
  collections: ICollectionRecord[];
}> {
  const query = memberId ? `?memberId=${encodeURIComponent(memberId)}` : "";
  try {
    const res = await fetch(`${BASE_URL}/operations/collections${query}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch collections");
    const json = await res.json();
    const payload = json.data || {};
    const cols = Array.isArray(payload.collections)
      ? payload.collections
      : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];

    return {
      memberInfo: payload.memberInfo,
      collections: cols,
    } as any;
  } catch (err) {
    console.warn("Backend /operations/collections failed, fallback", err);
    if (!memberId) {
      return { collections: INITIAL_RECENT_COLLECTIONS };
    }
    const memberCols = INITIAL_RECENT_COLLECTIONS.filter(
      (c) => c.memberId === memberId || c.memberCode === memberId
    );
    return {
      memberInfo: {
        _id: memberId,
        memberCode: memberId,
        fullName: memberCols[0]?.memberName || "Tarek Abdulla",
        dueAmount: 26000,
        advanceBalance: 0,
        totalDeposit: 72000,
      },
      collections: memberCols.length > 0 ? memberCols : INITIAL_RECENT_COLLECTIONS.slice(0, 7),
    };
  }
}

/**
 * 3. POST /api/v1/operations/collect
 */
export async function collectPaymentApi(payload: IPaymentPayload): Promise<IPaymentResult> {
  const res = await fetch(`${BASE_URL}/operations/collect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const details = errorData?.errorSources?.map((es: any) => es.message).filter(Boolean).join(". ");
    throw new Error(details || errorData?.message || "Failed to record payment");
  }

  const json = await res.json();
  return json.data;
}

/**
 * 4. Export URLs (STRICT: PDF and XLSX only. No CSV allowed)
 */
export function getExportPdfUrl(filters: IDueListFilterParams = {}): string {
  const query = new URLSearchParams();
  if (filters.searchByCodeOrName) query.append("searchByCodeOrName", filters.searchByCodeOrName);
  if (filters.year) query.append("year", filters.year);
  if (filters.status && filters.status !== "All") query.append("status", filters.status);
  if (filters.dateRange) query.append("dateRange", filters.dateRange);
  return `${BASE_URL}/operations/export/pdf?${query.toString()}`;
}

export function getExportExcelUrl(filters: IDueListFilterParams = {}): string {
  const query = new URLSearchParams();
  if (filters.searchByCodeOrName) query.append("searchByCodeOrName", filters.searchByCodeOrName);
  if (filters.year) query.append("year", filters.year);
  if (filters.status && filters.status !== "All") query.append("status", filters.status);
  if (filters.dateRange) query.append("dateRange", filters.dateRange);
  return `${BASE_URL}/operations/export/excel?${query.toString()}`;
}

/**
 * Helper triggers browser file download from binary endpoints
 */
export async function downloadExportFile(
  type: "pdf" | "excel",
  filters: IDueListFilterParams = {}
): Promise<void> {
  const url = type === "pdf" ? getExportPdfUrl(filters) : getExportExcelUrl(filters);
  const ext = type === "pdf" ? "pdf" : "xlsx";
  const defaultFilename = `Due_List_Report_${new Date().toISOString().slice(0, 10)}.${ext}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Export failed with status ${res.status}`);

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
