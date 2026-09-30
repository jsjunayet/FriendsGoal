import { AuditLog } from "./auditLog.model";
import { ICreateAuditLogPayload } from "./auditLog.interface";

const INITIAL_AUDIT_SEED = [
  {
    logId: "001",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    action: "Member Added",
    target: "MD Karim Hossain",
    details: "New member registered with 5,000 initial deposit.",
    createdAt: new Date("2026-09-13T09:42:00Z"),
  },
  {
    logId: "002",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    action: "Payment Recorded",
    target: "MD Belal Hossain",
    details: "Monthly collection of 1,200 recorded for September.",
    createdAt: new Date("2026-09-13T09:18:00Z"),
  },
  {
    logId: "003",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    action: "Due Updated",
    target: "Sarah Jenkins",
    details: "Due amount adjusted from 800 to 1,100.",
    createdAt: new Date("2026-09-13T08:55:00Z"),
  },
  {
    logId: "004",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    action: "Withdrawal Approved",
    target: "Fatema Begum",
    details: "Withdrawal request WD-A3F9C2 approved for 4,554.",
    createdAt: new Date("2026-09-12T17:30:00Z"),
  },
  {
    logId: "005",
    adminName: "Sajid Mahmud",
    adminAvatar: "SM",
    action: "Amount Modified",
    target: "John Doe",
    details: "Balance adjustment from 3,200 to 2,900 (fee reversal).",
    createdAt: new Date("2026-09-12T16:14:00Z"),
  },
  {
    logId: "006",
    adminName: "Rania Islam",
    adminAvatar: "RI",
    action: "Report Generated",
    target: "All Members",
    details: "Monthly dues report exported as CSV.",
    createdAt: new Date("2026-09-12T15:08:00Z"),
  },
  {
    logId: "007",
    adminName: "Tarek Farouq",
    adminAvatar: "TF",
    action: "Withdrawal Rejected",
    target: "MD Juwel Hasan",
    details: "Request WD-B7D1E3 rejected — insufficient profit.",
    createdAt: new Date("2026-09-12T14:47:00Z"),
  },
  {
    logId: "008",
    adminName: "Nusrat Akter",
    adminAvatar: "NA",
    action: "Settings Changed",
    target: "System",
    details: "Interest rate updated from 5.5% to 6.0%.",
    createdAt: new Date("2026-09-12T13:22:00Z"),
  },
];

export const generateNextLogId = async (): Promise<string> => {
  const count = await AuditLog.countDocuments();
  const nextNum = count + 1;
  return String(nextNum).padStart(3, "0");
};

/**
 * 1. Log an admin action
 */
const createAuditLogInDB = async (payload: ICreateAuditLogPayload) => {
  const logId = await generateNextLogId();

  const initials =
    payload.adminAvatar ||
    (payload.adminName
      ? payload.adminName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "AD");

  const newLog = await AuditLog.create({
    ...payload,
    logId,
    adminAvatar: initials,
    adminName: payload.adminName || "Admin",
    createdAt: payload.createdAt || new Date(),
  });

  return newLog;
};

/**
 * 2. Get Audit Logs with pagination & filters
 */
const getAuditLogsFromDB = async (query: Record<string, any>) => {
  // Check if seeding is needed
  const totalInDB = await AuditLog.countDocuments();
  if (totalInDB === 0) {
    await AuditLog.insertMany(INITIAL_AUDIT_SEED);
  }

  const filter: Record<string, any> = {};

  if (query.action && query.action !== "All") {
    filter.action = query.action;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [
      { logId: searchRegex },
      { adminName: searchRegex },
      { action: searchRegex },
      { target: searchRegex },
      { details: searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 18;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1,
    },
    data,
  };
};

export const AuditLogServices = {
  createAuditLogInDB,
  getAuditLogsFromDB,
};
