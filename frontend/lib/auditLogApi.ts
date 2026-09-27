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
const INITIAL_AUDIT_LOGS: IAuditLogItem[] = [
  {
    logId: "001",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]", // green
    action: "Member Added",
    target: "MD Karim Hossain",
    date: "13 Sept 2026",
    timeAgo: "09:42 AM · 12h ago",
    details: "New member registered with 5,000 initial deposit.",
  },
  {
    logId: "002",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    avatarColor: "bg-[#2F80ED]", // blue
    action: "Payment Recorded",
    target: "MD Belal Hossain",
    date: "13 Sept 2026",
    timeAgo: "09:18 AM · 12h ago",
    details: "Monthly collection of 1,200 recorded for September.",
  },
  {
    logId: "003",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]", // green
    action: "Due Updated",
    target: "Sarah Jenkins",
    date: "13 Sept 2026",
    timeAgo: "08:55 AM · 12h ago",
    details: "Due amount adjusted from 800 to 1,100.",
  },
  {
    logId: "004",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    avatarColor: "bg-[#5B63D3]", // indigo
    action: "Withdrawal Approved",
    target: "Fatema Begum",
    date: "12 Sept 2026",
    timeAgo: "05:30 PM · 1d ago",
    details: "Withdrawal request WD-A3F9C2 approved for 4,554.",
  },
  {
    logId: "005",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    avatarColor: "bg-[#2F80ED]", // blue
    action: "Amount Modified",
    target: "John Doe",
    date: "12 Sept 2026",
    timeAgo: "04:14 PM · 1d ago",
    details: "Balance adjustment from 3,200 to 2,900 (fee reversal).",
  },
  {
    logId: "006",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]", // green
    action: "Report Generated",
    target: "All Members",
    date: "12 Sept 2026",
    timeAgo: "03:08 PM · 1d ago",
    details: "Monthly dues report exported as CSV.",
  },
  {
    logId: "007",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    avatarColor: "bg-[#5B63D3]", // indigo
    action: "Withdrawal Rejected",
    target: "MD Juwel Hasan",
    date: "12 Sept 2026",
    timeAgo: "02:47 PM · 1d ago",
    details: "Request WD-B7D1E3 rejected — insufficient profit.",
  },
  {
    logId: "008",
    adminName: "Nusrat Akter",
    adminAvatar: "NA",
    avatarColor: "bg-[#F2994A]", // amber
    action: "Settings Changed",
    target: "System",
    date: "12 Sept 2026",
    timeAgo: "01:22 PM · 1d ago",
    details: "Interest rate updated from 5.5% to 6.0%.",
  },
  {
    logId: "009",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    avatarColor: "bg-[#2F80ED]",
    action: "Member Added",
    target: "Kamal Uddin",
    date: "11 Sept 2026",
    timeAgo: "11:15 AM · 2d ago",
    details: "New member profile created with verified NID.",
  },
  {
    logId: "010",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]",
    action: "Payment Recorded",
    target: "Anowar Hossain",
    date: "11 Sept 2026",
    timeAgo: "10:30 AM · 2d ago",
    details: "Deposit of 2,500 credited to savings balance.",
  },
  {
    logId: "011",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    avatarColor: "bg-[#5B63D3]",
    action: "Withdrawal Approved",
    target: "Salma Khatun",
    date: "10 Sept 2026",
    timeAgo: "04:10 PM · 3d ago",
    details: "Withdrawal request WD-H4J9K1 approved for 3,000.",
  },
  {
    logId: "012",
    adminName: "Nusrat Akter",
    adminAvatar: "NA",
    avatarColor: "bg-[#F2994A]",
    action: "Amount Modified",
    target: "Rashid Khan",
    date: "10 Sept 2026",
    timeAgo: "02:00 PM · 3d ago",
    details: "Savings adjustment corrected by 500.",
  },
  {
    logId: "013",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    avatarColor: "bg-[#2F80ED]",
    action: "Due Updated",
    target: "Farzana Yasmin",
    date: "09 Sept 2026",
    timeAgo: "12:45 PM · 4d ago",
    details: "Due penalty waived per executive committee approval.",
  },
  {
    logId: "014",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]",
    action: "Report Generated",
    target: "Executive Committee",
    date: "09 Sept 2026",
    timeAgo: "09:30 AM · 4d ago",
    details: "Quarterly portfolio yield report exported as PDF.",
  },
  {
    logId: "015",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    avatarColor: "bg-[#5B63D3]",
    action: "Withdrawal Rejected",
    target: "Hasina Begum",
    date: "08 Sept 2026",
    timeAgo: "03:15 PM · 5d ago",
    details: "Request WD-P8M2L4 rejected — KYC document expired.",
  },
  {
    logId: "016",
    adminName: "Nusrat Akter",
    adminAvatar: "NA",
    avatarColor: "bg-[#F2994A]",
    action: "Settings Changed",
    target: "System",
    date: "08 Sept 2026",
    timeAgo: "11:00 AM · 5d ago",
    details: "Monthly payment collection deadline set to 15th.",
  },
  {
    logId: "017",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    avatarColor: "bg-[#2F80ED]",
    action: "Member Added",
    target: "Tanvir Ahmed",
    date: "07 Sept 2026",
    timeAgo: "01:20 PM · 6d ago",
    details: "New active member onboarded into central registry.",
  },
  {
    logId: "018",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    avatarColor: "bg-[#00B074]",
    action: "Payment Recorded",
    target: "Ziaur Rahman",
    date: "07 Sept 2026",
    timeAgo: "10:10 AM · 6d ago",
    details: "Annual membership fee of 1,000 received via bKash.",
  },
];

let inMemoryAuditLogs: IAuditLogItem[] = [...INITIAL_AUDIT_LOGS];

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
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
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
              total: json.meta?.total || transformed.length,
              totalPage:
                json.meta?.totalPage || Math.ceil(transformed.length / limit),
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
