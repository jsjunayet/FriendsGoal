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
  memberAvatar?: string;
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

const INITIAL_WITHDRAWALS: IWithdrawalItem[] = [];

let inMemoryWithdrawals: IWithdrawalItem[] = [];

export const withdrawalApi = {
  getWithdrawals: async (
    query: { statusTab?: "All" | "Pending" | "Approved" | "Rejected"; search?: string; memberId?: string } = {}
  ): Promise<IWithdrawalListResponse> => {
    const { statusTab = "All", search, memberId } = query;
    try {
      const queryParams = new URLSearchParams();
      if (statusTab !== "All") queryParams.append("status", statusTab);
      if (search) queryParams.append("search", search);
      if (memberId) queryParams.append("memberId", memberId);

      let token = null;
      if (typeof window !== "undefined") {
        token = sessionStorage.getItem("fg_access_token");
      }

      const res = await fetch(`${API_BASE_URL}/withdrawals?${queryParams.toString()}`, {
        cache: "no-store",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
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
                memberName: item.member?.fullName || item.memberName || "Member",
                memberInitials: initials,
                avatarColor: colors[idx % colors.length],
                memberAvatar: item.member?.pictureUrl || null,
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
      throw new Error("Failed to fetch withdrawals");
    } catch (err) {
      console.error(err);
      throw err;
    }
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

    let token = null;
    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("fg_access_token");
    }

    // Call backend API
    try {
      const res = await fetch(`${API_BASE_URL}/withdrawals/${idOrRef}/respond`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          action: payload.action,
          adminNote: payload.adminNote,
          reviewerName,
        }),
      });
      if (!res.ok) throw new Error("API Response not OK");
    } catch (err) {
      console.error(err);
      throw err;
    }

    return target || inMemoryWithdrawals[0];
  },
};
