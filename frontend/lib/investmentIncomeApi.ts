export interface IInvestmentIncome {
  _id?: string;
  numericId?: number;
  investmentId: string;
  investmentName: string;
  date: string;
  amount: number;
  remarks: string;
  distributedToCount?: number;
  perMemberProfit?: number;
  createdAt?: string;
}

export interface ICreateInvestmentIncomePayload {
  investmentId: string;
  date: string;
  amount: number;
  remarks: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getAuthHeaders = (): Record<string, string> => {
  let token = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("fg_access_token");
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const investmentIncomeApi = {
  getInvestmentIncomes: async (filters?: { fromDate?: string; toDate?: string }) => {
    let url = `${API_BASE_URL}/investment-incomes`;
    const params = new URLSearchParams();
    if (filters?.fromDate) params.append("fromDate", filters.fromDate);
    if (filters?.toDate) params.append("toDate", filters.toDate);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { ...getAuthHeaders() },
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch incomes");
    return json.data;
  },

  createInvestmentIncome: async (payload: ICreateInvestmentIncomePayload) => {
    const res = await fetch(`${API_BASE_URL}/investment-incomes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      const errorMsg = json.errorSources ? `${json.message}: ${json.errorSources.map((e: any) => e.message).join(", ")}` : json.message;
      throw new Error(errorMsg || "Failed to create income");
    }
    return json.data;
  },
};
