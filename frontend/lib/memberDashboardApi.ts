const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IPaymentScheduleItem {
  receiptNo: string;
  month: string;
  amount: number;
  status: "Paid" | "Due" | "Advance" | string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface IMemberDashboardSummary {
  memberId: string;
  fullName: string;
  memberCode: string;
  email: string;
  role: string;
  status: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  division?: string;
  district?: string;
  thana?: string;
  pictureUrl?: string;
  totalDeposit: number;
  dueAmount: number;
  profitBalance: number;
  totalWithdrawn: number;
  savingsBalance: number;
  depositBalance: number;
  pendingWithdrawal: number;
  activePaymentSchedule: IPaymentScheduleItem[];
}

export interface IWithdrawalRequestPayload {
  memberId: string;
  amount: number;
  method?: string;
  accountDetails?: string;
  payoutMethod?: string;
  accountNumber?: string;
  reason?: string;
}

export const memberDashboardApi = {
  getDashboardSummary: async (): Promise<IMemberDashboardSummary> => {
    try {
      let token = null;
      if (typeof window !== "undefined") {
        token = sessionStorage.getItem("fg_access_token");
      }

      const res = await fetch(`${API_BASE_URL}/members/me/dashboard-summary`, {
        cache: "no-store",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);
      throw error;
    }
    throw new Error("Failed to fetch dashboard summary");
  },

  getProfitBalance: async (memberId?: string): Promise<{ profitBalance: number }> => {
    try {
      const endpoint = memberId && memberId !== "me"
        ? `${API_BASE_URL}/members/${memberId}/profit-balance`
        : `${API_BASE_URL}/members/me/profit-balance`;

      let token = null;
      if (typeof window !== "undefined") {
        token = sessionStorage.getItem("fg_access_token");
      }

      const res = await fetch(endpoint, {
        cache: "no-store",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return {
            profitBalance: Number(json.data.profitBalance) || 0,
          };
        }
      }
    } catch (err) {
      console.error("Profit Balance API Error:", err);
      throw err;
    }

    throw new Error("Failed to fetch profit balance");
  },

  submitWithdrawalRequest: async (payload: IWithdrawalRequestPayload) => {
    let token = null;
    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("fg_access_token");
    }

    const res = await fetch(`${API_BASE_URL}/withdrawals/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        memberId: payload.memberId,
        amount: payload.amount,
        method: payload.method || payload.payoutMethod || "Mobile Banking",
        accountDetails: payload.accountDetails || payload.accountNumber || "",
        reason: payload.reason || "Personal expenses",
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to submit withdrawal request");
    }

    return json.data;
  },
};
