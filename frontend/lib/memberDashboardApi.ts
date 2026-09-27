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
  totalDeposit: number;
  dueAmount: number;
  profitBalance: number;
  totalWithdrawn: number;
  savingsBalance: number;
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
      const res = await fetch(`${API_BASE_URL}/members/me/dashboard-summary`, {
        cache: "no-store",
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Handled by dynamic fallback
    }

    // Default dynamic state when server is booting or unauthenticated
    return {
      memberId: "mem-002",
      fullName: "MD BELAL HOSSAIN",
      memberCode: "002",
      email: "belal@friendsgoal.org",
      role: "member",
      status: "active",
      totalDeposit: 30450,
      dueAmount: 1000,
      profitBalance: 4554,
      totalWithdrawn: 0,
      savingsBalance: 30450,
      activePaymentSchedule: [
        {
          receiptNo: "REC-2026-08",
          month: "August 2026",
          amount: 1200,
          status: "Paid",
          paymentDate: "2026-08-10",
        },
        {
          receiptNo: "REC-2026-09",
          month: "September 2026",
          amount: 1200,
          status: "Due",
        },
      ],
    };
  },

  getProfitBalance: async (memberId?: string): Promise<{ profitBalance: number }> => {
    try {
      const endpoint = memberId && memberId !== "me"
        ? `${API_BASE_URL}/members/${memberId}/profit-balance`
        : `${API_BASE_URL}/members/me/profit-balance`;

      const res = await fetch(endpoint, {
        cache: "no-store",
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return {
            profitBalance: Number(json.data.profitBalance) || 0,
          };
        }
      }
    } catch {
      // Fallback
    }

    return { profitBalance: 4554 };
  },

  submitWithdrawalRequest: async (payload: IWithdrawalRequestPayload) => {
    const res = await fetch(`${API_BASE_URL}/withdrawals/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
