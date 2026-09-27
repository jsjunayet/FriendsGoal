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

// ─── Initial Mock Expenses matching Screenshot 1 ──────────────────────────────
export const INITIAL_EXPENSES: IExpenseRecord[] = [
  {
    _id: "exp-1",
    expenseId: 1,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Software Cost",
    expenseDate: "2025-10-22",
    amount: 60000.0,
    remarks: "FG Website and ERP Software Development",
    voucherNo: "EXP-00001",
  },
  {
    _id: "exp-2",
    expenseId: 2,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-07",
    amount: 4200.0,
    remarks: "Letter Head(120gms)",
    voucherNo: "EXP-00002",
  },
  {
    _id: "exp-3",
    expenseId: 3,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-07",
    amount: 3200.0,
    remarks: "Money Receipt(1000pcs)",
    voucherNo: "EXP-00003",
  },
  {
    _id: "exp-4",
    expenseId: 4,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-07",
    amount: 420.0,
    remarks: "Auto Round Seal",
    voucherNo: "EXP-00004",
  },
  {
    _id: "exp-5",
    expenseId: 5,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-07",
    amount: 840.0,
    remarks: "Auto Seal 3Pcs",
    voucherNo: "EXP-00005",
  },
  {
    _id: "exp-6",
    expenseId: 6,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-24",
    amount: 330.0,
    remarks: "Stamp(100tk) 3pcs",
    voucherNo: "EXP-00006",
  },
  {
    _id: "exp-7",
    expenseId: 7,
    memberName: "MD. JUWEL HASAN",
    expenseHead: "Office Goods",
    expenseDate: "2024-09-24",
    amount: 1230.0,
    remarks: "Stamp Cartige 41pcs",
    voucherNo: "EXP-00007",
  },
];

// Persistent local storage cache fallback for browser session
let inMemoryExpenses = [...INITIAL_EXPENSES];
let inMemoryCategories = [...INITIAL_CATEGORIES];

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("fg_access_token");
    if (token) {
      headers["Authorization"] = token;
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
    if (errJson && errJson.message) {
      throw new Error(errJson.message);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes("fetch")) {
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
