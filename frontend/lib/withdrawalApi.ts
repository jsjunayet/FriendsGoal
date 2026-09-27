import { auditLogApi } from "./auditLogApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type TWithdrawalStatus = "Pending" | "Approved" | "Rejected";
export type TWithdrawalMethod =
  | "Mobile Banking"
  | "Bank Transfer"
  | "Cash Pickup"
  | string;

export interface IWithdrawalItem {
  _id: string;
  referenceId: string; // e.g. "A3F9C2"
  memberId?: string;
  memberName: string;
  memberInitials: string;
  avatarColor?: string;
  amount: number;
  method: TWithdrawalMethod;
  accountDetails: string;
  reason: string;
  submittedDate: string;
  submittedTimeAgo: string;
  status: TWithdrawalStatus;
  adminNote?: string;
  reviewedByName?: string;
  reviewedAt?: string;
}

export interface IWithdrawalCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface IWithdrawalListResponse {
  data: IWithdrawalItem[];
  counts: IWithdrawalCounts;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface IRespondPayload {
  action: "approve" | "reject";
  adminNote?: string;
  reviewerName?: string;
}

// 4 Initial Seed Records matching Screenshots 2, 3, 4
const INITIAL_WITHDRAWALS: IWithdrawalItem[] = [
  {
    _id: "wd-1",
    referenceId: "A3F9C2",
    memberName: "MD Juwel Hasan",
    memberInitials: "MJ",
    avatarColor: "bg-[#2F80ED]",
    amount: 3200,
    method: "Mobile Banking",
    accountDetails: "bKash 01712-334455",
    reason: "Personal expenses",
    submittedDate: "12 Sept 2026",
    submittedTimeAgo: "6d ago",
    status: "Pending",
  },
  {
    _id: "wd-2",
    referenceId: "B7D1E3",
    memberName: "Sarah Jenkins",
    memberInitials: "SJ",
    avatarColor: "bg-[#5B63D3]",
    amount: 1500,
    method: "Bank Transfer",
    accountDetails: "City Bank 10928374829",
    reason: "Monthly dividend payout",
    submittedDate: "11 Sept 2026",
    submittedTimeAgo: "7d ago",
    status: "Approved",
    reviewedByName: "Rania Islam",
  },
  {
    _id: "wd-3",
    referenceId: "C9E4A1",
    memberName: "Fatema Begum",
    memberInitials: "FB",
    avatarColor: "bg-[#00B074]",
    amount: 4554,
    method: "Mobile Banking",
    accountDetails: "Nagad 01819-887766",
    reason: "Emergency medical fund",
    submittedDate: "13 Sept 2026",
    submittedTimeAgo: "5d ago",
    status: "Pending",
  },
  {
    _id: "wd-4",
    referenceId: "D2F8B7",
    memberName: "MD Belal Hossain",
    memberInitials: "MB",
    avatarColor: "bg-[#F2994A]",
    amount: 6000,
    method: "Cash Pickup",
    accountDetails: "Main Office Counter",
    reason: "Business inventory",
    submittedDate: "10 Sept 2026",
    submittedTimeAgo: "8d ago",
    status: "Rejected",
    adminNote: "insufficient profit",
    reviewedByName: "Tarek Farouq",
  },
];

let inMemoryWithdrawals: IWithdrawalItem[] = [...INITIAL_WITHDRAWALS];

export const withdrawalApi = {
  getWithdrawals: async (
    statusTab: "All" | "Pending" | "Approved" | "Rejected" = "All",
    search?: string
  ): Promise<IWithdrawalListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (statusTab !== "All") queryParams.append("status", statusTab);
      if (search) queryParams.append("search", search);

      const res = await fetch(`${API_BASE_URL}/withdrawals?${queryParams.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const transformed: IWithdrawalItem[] = json.data.map(
            (item: any, idx: number) => {
              const d = new Date(item.submittedAt || item.createdAt || Date.now());
              const dateStr = d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              // Clean display reference ID (e.g. WD-A3F9C2 -> A3F9C2)
              const cleanId = (item.referenceId || "WD-REQ").replace(/^WD-/, "");

              const initials =
                item.memberName
                  ?.split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "MB";

              const colors = [
                "bg-[#2F80ED]",
                "bg-[#5B63D3]",
                "bg-[#00B074]",
                "bg-[#F2994A]",
              ];

              return {
                _id: item._id,
                referenceId: cleanId,
                memberId: item.memberId,
                memberName: item.memberName || "Member",
                memberInitials: initials,
                avatarColor: colors[idx % colors.length],
                amount: Number(item.amount) || 0,
                method: item.method || item.payoutMethod || "Mobile Banking",
                accountDetails: item.accountDetails || item.accountNumber || "bKash",
                reason: item.reason || "Personal expenses",
                submittedDate: dateStr,
                submittedTimeAgo: "recently",
                status: (item.status as TWithdrawalStatus) || "Pending",
                adminNote: item.adminNote,
                reviewedByName: item.reviewedByName,
                reviewedAt: item.reviewedAt,
              };
            }
          );

          // Calculate counts
          const allCount = transformed.length;
          const pendingCount = transformed.filter(
            (w) => w.status === "Pending"
          ).length;
          const approvedCount = transformed.filter(
            (w) => w.status === "Approved"
          ).length;
          const rejectedCount = transformed.filter(
            (w) => w.status === "Rejected"
          ).length;

          let filtered = transformed;
          if (statusTab !== "All") {
            filtered = filtered.filter((w) => w.status === statusTab);
          }

          return {
            data: filtered,
            counts: {
              all: json.meta?.counts?.all || allCount,
              pending: json.meta?.counts?.pending || pendingCount,
              approved: json.meta?.counts?.approved || approvedCount,
              rejected: json.meta?.counts?.rejected || rejectedCount,
            },
            meta: json.meta || {
              page: 1,
              limit: 20,
              total: filtered.length,
              totalPage: 1,
            },
          };
        }
      }
    } catch {
      // Backend offline fallback handled below
    }

    // In-memory fallback
    const all = inMemoryWithdrawals.length;
    const pending = inMemoryWithdrawals.filter((w) => w.status === "Pending").length;
    const approved = inMemoryWithdrawals.filter((w) => w.status === "Approved").length;
    const rejected = inMemoryWithdrawals.filter((w) => w.status === "Rejected").length;

    let filtered = [...inMemoryWithdrawals];
    if (statusTab !== "All") {
      filtered = filtered.filter((w) => w.status === statusTab);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.referenceId.toLowerCase().includes(q) ||
          w.memberName.toLowerCase().includes(q) ||
          w.method.toLowerCase().includes(q) ||
          w.accountDetails.toLowerCase().includes(q) ||
          w.reason.toLowerCase().includes(q)
      );
    }

    return {
      data: filtered,
      counts: { all, pending, approved, rejected },
      meta: {
        page: 1,
        limit: 20,
        total: filtered.length,
        totalPage: 1,
      },
    };
  },

  respondWithdrawal: async (
    idOrRef: string,
    payload: IRespondPayload
  ): Promise<IWithdrawalItem> => {
    const isApprove = payload.action === "approve";
    const reviewerName =
      payload.reviewerName || (isApprove ? "Rania Islam" : "Tarek Farouq");
    const newStatus: TWithdrawalStatus = isApprove ? "Approved" : "Rejected";

    // Update in-memory item
    const target = inMemoryWithdrawals.find(
      (w) =>
        w._id === idOrRef ||
        w.referenceId === idOrRef ||
        w.referenceId === idOrRef.replace(/^WD-/, "")
    );

    if (target) {
      target.status = newStatus;
      target.reviewedByName = reviewerName;
      target.adminNote = payload.adminNote?.trim();
      target.reviewedAt = new Date().toISOString();
    }

    // Record system AuditLog entry matching specifications
    if (target) {
      if (isApprove) {
        await auditLogApi.recordLog({
          adminName: reviewerName,
          action: "Withdrawal Approved",
          target: target.memberName,
          details: `Withdrawal request WD-${target.referenceId} approved for ${(Number(target?.amount) || 0).toLocaleString()}.`,
        });
      } else {
        await auditLogApi.recordLog({
          adminName: reviewerName,
          action: "Withdrawal Rejected",
          target: target.memberName,
          details: `Request WD-${target.referenceId} rejected — ${payload.adminNote || "insufficient profit"}.`,
        });
      }
    }

    // Call backend API
    try {
      await fetch(`${API_BASE_URL}/withdrawals/${idOrRef}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: payload.action,
          adminNote: payload.adminNote,
          reviewerName,
        }),
      });
    } catch {
      // Backend fallback handled
    }

    return target || inMemoryWithdrawals[0];
  },
};
