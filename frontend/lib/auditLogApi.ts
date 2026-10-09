const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type TAuditAction =
  | "Member Added"
  | "Payment Recorded"
  | "Due Updated"
  | "Withdrawal Approved"
  | "Withdrawal Rejected"
  | "Amount Modified"
  | "Report Generated"
  | "Settings Changed"
  | string;

export interface IAuditLogItem {
  _id?: string;
  logId: string; // e.g. "001", "002"
  adminName: string; // e.g. "Rania Islam"
  adminAvatar: string; // e.g. "RI"
  avatarColor?: string; // background color for avatar
  action: TAuditAction;
  target: string;
  date: string; // e.g. "13 Sept 2026"
  timeAgo: string; // e.g. "09:42 AM · 12h ago"
  details: string;
  createdAt?: string;
}

export interface IAuditLogResponse {
  data: IAuditLogItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// 18 seed entries matching Screenshot 1 and giving 3 pages of entries (18 total, Page 1 of 3)
const INITIAL_AUDIT_LOGS: IAuditLogItem[] = [];

let inMemoryAuditLogs: IAuditLogItem[] = [];

export const auditLogApi = {
  getLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    search?: string;
  }): Promise<IAuditLogResponse> => {
    const page = params?.page || 1;
    const limit = params?.limit || 8; // 8 items per page matches Screenshot 1 perfectly (Page 1 of 3, 18 entries)

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (params?.action && params.action !== "All")
        queryParams.append("action", params.action);
      if (params?.search) queryParams.append("search", params.search);

      const res = await fetch(`${API_BASE_URL}/audit-logs?${queryParams.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const transformed: IAuditLogItem[] = json.data.map(
            (item: any, idx: number) => {
              const d = new Date(item.createdAt || Date.now());
              const dateStr = d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeStr = d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const avatarColors = [
                "bg-[#00B074]",
                "bg-[#2F80ED]",
                "bg-[#5B63D3]",
                "bg-[#F2994A]",
              ];

              return {
                _id: item._id,
                logId: item.logId || String(idx + 1).padStart(3, "0"),
                adminName: item.adminName || "Admin",
                adminAvatar:
                  item.adminAvatar ||
                  (item.adminName
                    ? item.adminName
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                    : "AD"),
                avatarColor: avatarColors[idx % avatarColors.length],
                action: item.action,
                target: item.target,
                date: dateStr,
                timeAgo: `${timeStr} · recently`,
                details: item.details,
                createdAt: item.createdAt,
              };
            }
          );

          return {
            data: transformed,
            meta: json.meta || {
              page,
              limit,
              total: json.meta?.total ?? transformed.length,
              totalPage:
                json.meta?.totalPage ?? Math.max(1, Math.ceil(transformed.length / limit)),
            },
          };
        }
      }
    } catch {
      // Fallback to in-memory store
    }

    let filtered = [...inMemoryAuditLogs];
    if (params?.action && params.action !== "All") {
      filtered = filtered.filter((item) => item.action === params.action);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.logId.toLowerCase().includes(q) ||
          item.adminName.toLowerCase().includes(q) ||
          item.target.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPage = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  },

  recordLog: async (payload: {
    adminName?: string;
    action: TAuditAction;
    target: string;
    details: string;
  }): Promise<IAuditLogItem> => {
    const adminName = payload.adminName || "Rania Islam";
    const initials = adminName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const nextIdNum = inMemoryAuditLogs.length + 1;
    const logId = String(nextIdNum).padStart(3, "0");

    const newLog: IAuditLogItem = {
      logId,
      adminName,
      adminAvatar: initials,
      avatarColor: "bg-[#00B074]",
      action: payload.action,
      target: payload.target,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      timeAgo: "Just now",
      details: payload.details,
    };

    inMemoryAuditLogs.unshift(newLog);

    try {
      await fetch(`${API_BASE_URL}/audit-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminName,
          adminAvatar: initials,
          action: payload.action,
          target: payload.target,
          details: payload.details,
        }),
      });
    } catch {
      // Backend offline fallback handled by in-memory
    }

    return newLog;
  },
};
