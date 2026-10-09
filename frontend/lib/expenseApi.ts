export interface IExpenseCategory {
  _id: string;
  name: string;
  order: number;
}

export interface IExpenseRecord {
  _id: string;
  expenseId: number;
  memberName: string;
  memberCode?: string;
  expenseHead: string;
  expenseDate: string;
  amount: number;
  remarks: string;
  voucherNo?: string;
  createdAt?: string;
}

export interface ICreateExpensePayload {
  expenseHead: string;
  memberId?: string;
  memberName: string;
  memberCode?: string;
  expenseDate: string;
  amount: number;
  remarks: string;
}

export interface IExpenseFilterParams {
  search?: string;
  expenseHead?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IExpenseListResponse {
  data: IExpenseRecord[];
  meta: TMeta;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

// ─── Initial Mock Categories matching Screenshot 3 ────────────────────────────
export const INITIAL_CATEGORIES: IExpenseCategory[] = [
  { _id: "cat-1", name: "Software Cost", order: 0 },
  { _id: "cat-2", name: "Office Goods", order: 1 },
  { _id: "cat-3", name: "Travel", order: 2 },
  { _id: "cat-4", name: "Salary", order: 3 },
  { _id: "cat-5", name: "Advertising", order: 4 },
  { _id: "cat-6", name: "Tax & Compliance", order: 5 },
  { _id: "cat-7", name: "Utilities", order: 6 },
  { _id: "cat-8", name: "Training", order: 7 },
];

export const INITIAL_EXPENSES: IExpenseRecord[] = [];

// Persistent local storage cache fallback for browser session
let inMemoryExpenses: IExpenseRecord[] = [];
let inMemoryCategories = [...INITIAL_CATEGORIES];

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
 * 1. GET /api/v1/expenses
 */
export async function fetchExpensesApi(
  filters: IExpenseFilterParams = {}
): Promise<IExpenseListResponse> {
  const query = new URLSearchParams();
  if (filters.search) query.append("search", filters.search);
  if (filters.expenseHead) query.append("expenseHead", filters.expenseHead);
  if (filters.fromDate) query.append("fromDate", filters.fromDate);
  if (filters.toDate) query.append("toDate", filters.toDate);
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  try {
    const res = await fetch(`${BASE_URL}/expenses?${query.toString()}`, {
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
    console.warn("Backend /expenses request failed, falling back to client cache", err);
  }

  // Client-side fallback
  let filtered = [...inMemoryExpenses];

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.memberName.toLowerCase().includes(term) ||
        e.expenseHead.toLowerCase().includes(term) ||
        e.remarks.toLowerCase().includes(term) ||
        String(e.expenseId).includes(term) ||
        String(e.amount).includes(term)
    );
  }

  if (filters.expenseHead && filters.expenseHead !== "All") {
    filtered = filtered.filter((e) => e.expenseHead === filters.expenseHead);
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
 * 2. POST /api/v1/expenses
 */
export async function createExpenseApi(
  payload: ICreateExpensePayload
): Promise<IExpenseRecord> {
  try {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        inMemoryExpenses.unshift(json.data);
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
    console.warn("Backend /expenses create failed, using client storage", err);
  }

  // Fallback client creation
  const nextId = inMemoryExpenses.length > 0
    ? Math.max(...inMemoryExpenses.map((e) => e.expenseId)) + 1
    : 1;

  const newExpense: IExpenseRecord = {
    _id: `exp-${Date.now()}`,
    expenseId: nextId,
    memberName: payload.memberName,
    memberCode: payload.memberCode,
    expenseHead: payload.expenseHead,
    expenseDate: payload.expenseDate,
    amount: Number(payload.amount),
    remarks: payload.remarks,
    voucherNo: `EXP-${String(nextId).padStart(5, "0")}`,
    createdAt: new Date().toISOString(),
  };

  inMemoryExpenses.unshift(newExpense);
  return newExpense;
}

/**
 * 3. GET /api/v1/expense-categories
 */
export async function fetchExpenseCategoriesApi(): Promise<IExpenseCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/expense-categories`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        inMemoryCategories = json.data;
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend /expense-categories failed, using client fallback", err);
  }

  return [...inMemoryCategories].sort((a, b) => a.order - b.order);
}

/**
 * 4. POST /api/v1/expense-categories
 */
export async function createExpenseCategoryApi(name: string): Promise<IExpenseCategory> {
  try {
    const res = await fetch(`${BASE_URL}/expense-categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        inMemoryCategories.push(json.data);
        return json.data;
      }
    }
    const errJson = await res.json().catch(() => null);
    if (errJson && errJson.message) {
      throw new Error(errJson.message);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes("fetch")) {
      throw err;
    }
    console.warn("Backend add category failed, fallback", err);
  }

  const newCat: IExpenseCategory = {
    _id: `cat-${Date.now()}`,
    name,
    order: inMemoryCategories.length,
  };
  inMemoryCategories.push(newCat);
  return newCat;
}

/**
 * 5. PATCH /api/v1/expense-categories/reorder
 */
export async function reorderExpenseCategoriesApi(
  categories: { id: string; order: number }[]
): Promise<IExpenseCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/expense-categories/reorder`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ categories }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        inMemoryCategories = json.data;
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend reorder categories failed, fallback", err);
  }

  // Update in-memory categories
  const orderMap = new Map(categories.map((c) => [c.id, c.order]));
  inMemoryCategories.forEach((cat) => {
    if (orderMap.has(cat._id)) {
      cat.order = orderMap.get(cat._id)!;
    }
  });

  inMemoryCategories.sort((a, b) => a.order - b.order);
  return [...inMemoryCategories];
}
