import { AuditLog } from "./auditLog.model";
import { ICreateAuditLogPayload } from "./auditLog.interface";
import { Member } from "../Member/member.model";

export const generateNextLogId = async (): Promise<string> => {
  const count = await AuditLog.countDocuments();
  const nextNum = count + 1;
  return String(nextNum).padStart(3, "0");
};

/**
 * Sync existing members to AuditLog if not already logged
 */
const syncExistingMembersAuditLogs = async () => {
  try {
    const members = await Member.find({ isDeleted: false });
    for (const member of members) {
      const existingLog = await AuditLog.findOne({
        action: "Member Added",
        $or: [
          { target: { $regex: member.memberCode, $options: "i" } },
          { target: { $regex: member.fullName, $options: "i" } },
        ],
      });

      if (!existingLog) {
        await createAuditLogInDB({
          adminName: "Super Admin",
          adminRole: "Super Admin",
          action: "Member Added",
          target: `${member.fullName} (${member.memberCode})`,
          details: `Member ${member.fullName} (ID: ${member.memberCode}) registered into the system.`,
          createdAt: member.createdAt || new Date(),
        });
      }
    }
  } catch (err) {
    console.error("Failed to sync member audit logs:", err);
  }
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
  // Backfill existing members if not logged yet
  await syncExistingMembersAuditLogs();

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
