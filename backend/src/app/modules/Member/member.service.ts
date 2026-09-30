import httpStatus from "http-status";
import type { Response } from "express";
import ExcelJS from "exceljs";
import AppError from "../../errors/AppError";
import type { IMember } from "./member.interface";
import { Member } from "./member.model";
import { getDesignationBn } from "./member.utils";
import { Collection } from "../Operation/operation.model";
import { Withdrawal } from "../Withdrawal/withdrawal.model";
import { Adjustment } from "../Adjustment/adjustment.model";
import { streamReportToPdf, IPdfColumnConfig } from "../../services/reportPdfStream.service";
import { streamReportToExcel, IExcelColumnConfig } from "../../services/reportExcelStream.service";
import { streamMemberProfileToPdf } from "../../services/memberPdfStream.service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NotificationServices } from "../Notification/notification.service";

// ─── 1. Create Member ─────────────────────────────────────────────────────────

const createMemberIntoDB = async (payload: IMember) => {
  const existingMember = await Member.findOne({ email: payload.email });
  if (existingMember) {
    throw new AppError(httpStatus.BAD_REQUEST, "A member with this email already exists!");
  }

  // Auto-map designationBn if not given
  if (payload.designation && !payload.designationBn) {
    payload.designationBn = getDesignationBn(payload.designation);
  }

  // Ensure default balances are strictly 0.00 for new member registration
  if (payload.totalDeposit === undefined || payload.totalDeposit === null || Number(payload.totalDeposit) === 20000) {
    payload.totalDeposit = 0;
  }
  if (payload.savingsBalance === undefined || payload.savingsBalance === null || Number(payload.savingsBalance) === 1000) {
    payload.savingsBalance = 0;
  }
  if (payload.dueAmount === undefined || payload.dueAmount === null) {
    payload.dueAmount = 0;
  }

  // Generate temporary password if not provided
  let rawPassword = payload.password;
  if (!rawPassword) {
    rawPassword = crypto.randomBytes(4).toString("hex"); // e.g. "a1b2c3d4"
    payload.password = rawPassword;
  }

  const result = await Member.create(payload);

  // Send Onboarding Notification
  const loginUrl = process.env.FRONTEND_URL || "https://friendsgoal.com";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
      <h2 style="color: #00B074;">Welcome to Friends Goal Society</h2>
      <p>Hello <strong>${result.fullName}</strong>,</p>
      <p>Your member account has been successfully created.</p>
      <ul>
        <li><strong>Member ID:</strong> ${result.memberCode}</li>
        <li><strong>Designation:</strong> ${result.designation}</li>
        <li><strong>Role:</strong> ${result.role}</li>
      </ul>
      <p>You can access the member portal using the credentials below:</p>
      <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0;"><strong>Portal URL:</strong> <a href="${loginUrl}/login" style="color: #00B074;">${loginUrl}/login</a></p>
        <p style="margin: 5px 0 0 0;"><strong>Login Email:</strong> ${result.email}</p>
        <p style="margin: 5px 0 0 0;"><strong>Temporary Password:</strong> <code style="background: #E5E7EB; padding: 2px 5px; border-radius: 3px;">${rawPassword}</code></p>
      </div>
      <p style="color: #EF4444; font-size: 13px;"><strong>Security Instruction:</strong> Please log in and change your password immediately.</p>
    </div>
  `;

  await NotificationServices.createNotification({
    recipientId: result._id,
    title: "Welcome to Friends Goal Society",
    message: htmlBody, // Using the message field for HTML for now (service parses it)
    type: "MEMBER_ONBOARDING",
    channel: ["EMAIL", "SMS"],
    metadata: { temporaryPassword: rawPassword },
  });

  return result;
};

// ─── 2. Get All Members (Admin with Search & Pagination) ───────────────────────

const getAllMembersFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    councilCategory,
    designation,
    role,
    status,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const filterConditions: Record<string, unknown> = {
    isDeleted: false,
  };

  // Dynamic Search by fullName, mobileNo, memberCode, email, profession
  if (searchTerm) {
    filterConditions.$or = [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { mobileNo: { $regex: searchTerm, $options: "i" } },
      { memberCode: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { profession: { $regex: searchTerm, $options: "i" } },
      { designation: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (councilCategory) {
    filterConditions.councilCategory = councilCategory;
  }
  if (designation) {
    filterConditions.designation = designation;
  }
  if (role) {
    filterConditions.role = role;
  }
  if (status) {
    filterConditions.status = status;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const total = await Member.countDocuments(filterConditions);
  const totalPage = Math.ceil(total / limitNum) || 1;

  const result = await Member.find(filterConditions)
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum);

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage,
    },
    data: result,
  };
};

// ─── 3. Get Public Council Members ────────────────────────────────────────────

const getPublicCouncilMembersFromDB = async (query: Record<string, unknown>) => {
  const { category, designation, search } = query;

  const filterConditions: Record<string, unknown> = {
    isDeleted: false,
    status: "active",
  };

  if (category) {
    filterConditions.councilCategory = category;
  }

  if (designation) {
    filterConditions.designation = designation;
  }

  if (search) {
    filterConditions.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { designationBn: { $regex: search, $options: "i" } },
    ];
  }

  const result = await Member.find(filterConditions)
    .select(
      "memberCode fullName designation designationBn councilCategory bloodGroup profession mobileNo dateOfBirth division district thana presentAddress pictureUrl totalDeposit savingsBalance"
    )
    .sort("memberCode");

  return result;
};

// ─── 4. Get Single Member Details ─────────────────────────────────────────────

const getSingleMemberFromDB = async (id: string) => {
  // Support both Mongo _id and memberCode
  let result = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    result = await Member.findById(id);
  } else {
    result = await Member.findOne({ memberCode: id });
  }

  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  return result;
};

// ─── 5. Update Member Profile & Designation ───────────────────────────────────

const updateMemberIntoDB = async (id: string, payload: Partial<IMember>) => {
  // Check if member exists
  let member = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(id);
  } else {
    member = await Member.findOne({ memberCode: id });
  }

  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  // If designation is updated, auto-update designationBn if not supplied
  if (payload.designation && !payload.designationBn) {
    payload.designationBn = getDesignationBn(payload.designation);
  }

  // If password is updated, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updatedMember = await Member.findByIdAndUpdate(member._id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedMember;
};

// ─── 6. Permanently Delete Member ─────────────────────────────────────────────

const deleteMemberFromDB = async (id: string) => {
  let member = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(id);
  } else {
    member = await Member.findOne({ memberCode: id });
  }

  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  // Permanently delete as requested in requirement
  const result = await Member.findByIdAndDelete(member._id);
  return result;
};

// ─── 7. Member Dashboard Summary & Profit Balance ────────────────────────────

const getMemberDashboardSummaryFromDB = async (userIdOrEmail?: string) => {
  let member = null;
  if (userIdOrEmail) {
    if (userIdOrEmail.match(/^[0-9a-fA-F]{24}$/)) {
      member = await Member.findById(userIdOrEmail);
    } else {
      member = await Member.findOne({
        $or: [{ email: userIdOrEmail }, { memberCode: userIdOrEmail }],
      });
    }
  }

  // Removed fallback to random member to prevent data leakage

  if (!member) {
    // If it's a superadmin without a member profile, return a generic dashboard to prevent crash
    if (userIdOrEmail && userIdOrEmail.includes("@")) {
       return {
         memberId: "admin-system",
         fullName: "Super Admin",
         memberCode: "SYSTEM",
         email: userIdOrEmail,
         role: "superAdmin",
         status: "active",
         bloodGroup: "N/A",
         totalDeposit: 0,
         dueAmount: 0,
         profitBalance: 0,
         totalWithdrawn: 0,
         savingsBalance: 0,
         depositBalance: 0,
         pendingWithdrawal: 0,
         activePaymentSchedule: [],
       };
    }
    throw new AppError(httpStatus.NOT_FOUND, "Member record not found");
  }

  const rawProfit = (member as any).profitBalance;
  const profitBalance =
    rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
  const rawDeposit = member.totalDeposit;
  const totalDeposit =
    rawDeposit != null ? parseFloat(rawDeposit.toString()) : 0.0;
  const rawDue = member.dueAmount;
  const dueAmount = rawDue != null ? parseFloat(rawDue.toString()) : 0.0;
  const rawWithdrawn = (member as any).totalWithdrawn;
  const totalWithdrawn =
    rawWithdrawn != null ? parseFloat(rawWithdrawn.toString()) : 0.0;
  const rawSavings = member.savingsBalance;
  const savingsBalance =
    rawSavings != null ? parseFloat(rawSavings.toString()) : 0.0;
  
  const rawDepositBalance = member.depositBalance;
  const depositBalance = rawDepositBalance != null ? parseFloat(rawDepositBalance.toString()) : 0.0;
  
  const rawPending = member.pendingWithdrawal;
  const pendingWithdrawal = rawPending != null ? parseFloat(rawPending.toString()) : 0.0;

  // Fetch recent collections/payment schedules
  const { Collection } = await import("../Operation/operation.model");
  const recentCollections = await Collection.find({ member: member._id })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return {
    memberId: member._id,
    fullName: member.fullName,
    memberCode: member.memberCode,
    email: member.email,
    role: member.role,
    status: member.status,
    bloodGroup: member.bloodGroup,
    dateOfBirth: member.dateOfBirth,
    division: member.division,
    district: member.district,
    thana: member.thana,
    pictureUrl: member.pictureUrl,
    totalDeposit,
    dueAmount,
    profitBalance,
    totalWithdrawn,
    savingsBalance,
    depositBalance,
    pendingWithdrawal,
    activePaymentSchedule: recentCollections.map((c) => ({
      receiptNo: c.receiptNo,
      month: c.month,
      amount: c.amount,
      status: c.status,
      paymentDate: c.paymentDate,
      paymentMethod: c.paymentMethod,
    })),
  };
};

const getMemberProfitBalanceFromDB = async (userIdOrId?: string) => {
  let member = null;
  if (userIdOrId) {
    if (userIdOrId.match(/^[0-9a-fA-F]{24}$/)) {
      member = await Member.findById(userIdOrId);
    } else {
      member = await Member.findOne({
        $or: [{ email: userIdOrId }, { memberCode: userIdOrId }],
      });
    }
  }

  if (!member) {
    if (userIdOrId && userIdOrId.includes("@")) {
      return { profitBalance: 0 };
    }
    throw new AppError(httpStatus.NOT_FOUND, "Member record not found");
  }

  const rawProfit = (member as any).profitBalance;
  const profitBalance =
    rawProfit != null ? parseFloat(rawProfit.toString()) : 0.0;
  const rawDeposit = member.totalDeposit;
  const totalDeposit =
    rawDeposit != null ? parseFloat(rawDeposit.toString()) : 0.0;
  const rawDue = member.dueAmount;
  const dueAmount = rawDue != null ? parseFloat(rawDue.toString()) : 0.0;
  const rawWithdrawn = (member as any).totalWithdrawn;
  const totalWithdrawn =
    rawWithdrawn != null ? parseFloat(rawWithdrawn.toString()) : 0.0;

  return {
    memberId: member._id,
    fullName: member.fullName,
    memberName: member.fullName,
    memberCode: member.memberCode,
    profitBalance,
    totalDeposit,
    dueAmount,
    totalWithdrawn,
  };
};

/**
 * 9. Export All Members Directory (Streaming PDF & Excel)
 * High-performance, zero-memory-leak cursor batching for 1,000+ members.
 */
const exportAllMembersFromDB = async (
  res: Response,
  query: { status?: string; format?: string }
) => {
  const format = (query.format || "pdf").toLowerCase();
  const filter: Record<string, any> = { isDeleted: false };

  if (query.status && query.status.toUpperCase() !== "ALL") {
    filter.status = query.status.toLowerCase();
  }

  // Aggregate directory KPIs for metadata
  const [summary] = await Member.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalDeposit: { $sum: "$totalDeposit" },
        profitBalance: { $sum: "$profitBalance" },
        dueAmount: { $sum: "$dueAmount" },
        totalMembers: { $sum: 1 },
        activeMembers: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
      },
    },
  ]);

  const totalMembers = summary?.totalMembers || 0;
  const activeMembers = summary?.activeMembers || 0;
  const totalDeposit = summary?.totalDeposit || 0;
  const statusFilterText = query.status ? `Status: ${query.status.toUpperCase()}` : "All Members";
  const timestamp = new Date().toISOString().slice(0, 10);

  // MongoDB batching cursor: zero memory leak
  const cursor = Member.find(filter)
    .sort({ memberCode: 1 })
    .lean()
    .cursor();

  if (format === "excel") {
    const columns: IExcelColumnConfig[] = [
      { header: "ID / Member No", key: "memberCode", width: 15, alignment: "center" },
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Phone Number", key: "mobileNo", width: 18 },
      { header: "Status", key: "status", width: 12, alignment: "center" },
      { header: "Total Deposit", key: "totalDeposit", width: 18, alignment: "right", isCurrency: true },
      { header: "Profit Balance", key: "profitBalance", width: 18, alignment: "right", isCurrency: true },
      { header: "Due Amount", key: "dueAmount", width: 18, alignment: "right", isCurrency: true },
      { header: "Joined Date", key: "createdAt", width: 15, alignment: "center", isDate: true },
    ];

    await streamReportToExcel(res, {
      filename: `members-directory-${timestamp}.xlsx`,
      sheetName: "Members Directory",
      reportTitle: "MEMBER DIRECTORY REPORT",
      metadata: {
        "Filter Status": statusFilterText,
        "Total Members": totalMembers,
        "Active Members": activeMembers,
        "Total Society Deposits": `BDT ${totalDeposit.toLocaleString()}`,
      },
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["totalDeposit", "profitBalance", "dueAmount"],
    });
  } else {
    const columns: IPdfColumnConfig[] = [
      { header: "ID", key: "memberCode", width: 45, align: "center" },
      { header: "FULL NAME", key: "fullName", width: 105 },
      { header: "PHONE", key: "mobileNo", width: 75 },
      { header: "STATUS", key: "status", width: 45, align: "center" },
      { header: "TOTAL DEPOSIT", key: "totalDeposit", width: 70, align: "right", isCurrency: true },
      { header: "PROFIT BAL", key: "profitBalance", width: 65, align: "right", isCurrency: true },
      { header: "DUE AMOUNT", key: "dueAmount", width: 58, align: "right", isCurrency: true },
      { header: "JOINED DATE", key: "createdAt", width: 60, align: "center", isDate: true },
    ];

    await streamReportToPdf(res, {
      filename: `members-directory-${timestamp}.pdf`,
      reportTitle: "Member Directory Report",
      filtersSummary: statusFilterText,
      kpis: [
        { label: "Total Members", value: totalMembers },
        { label: "Active Members", value: activeMembers },
        { label: "Total Deposits", value: `BDT ${totalDeposit.toLocaleString()}` },
      ],
      columns,
      dataCursor: cursor,
      sumColumnKeys: ["totalDeposit", "profitBalance", "dueAmount"],
      grandTotalLabel: "Directory Totals",
    });
  }
};

/**
 * 10. Export Single Member Profile Card & Financial Statement (Streaming PDF & Excel)
 */
const exportSingleMemberFromDB = async (
  res: Response,
  id: string,
  format: string = "pdf"
) => {
  const query: Record<string, any> = { isDeleted: false };
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    query._id = id;
  } else {
    query.memberCode = id;
  }

  const member = await Member.findOne(query).lean();
  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Member record not found");
  }

  // Fetch Member's Transactions (Collections, Withdrawals, Adjustments)
  const [collections, withdrawals, adjustments, pendingWd] = await Promise.all([
    Collection.find({ member: member._id }).sort({ paymentDate: -1 }).lean(),
    Withdrawal.find({ memberId: member._id }).sort({ createdAt: -1 }).lean(),
    Adjustment.find({ memberId: member._id }).sort({ adjustmentDate: -1 }).lean(),
    Withdrawal.aggregate([
      { $match: { memberId: member._id, status: "Pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const pendingWithdrawals = pendingWd?.[0]?.total || 0;
  const totalDeposit = Number(member.totalDeposit) || 0;
  const profitBalance = Number(member.profitBalance) || 0;
  const dueAmount = Number(member.dueAmount) || 0;

  // Build unified transaction history ledger
  const transactions: Array<{
    date: Date | string;
    type: string;
    reference: string;
    amount: number;
    status: string;
    remarks: string;
  }> = [];

  for (const col of collections) {
    transactions.push({
      date: col.paymentDate || col.createdAt,
      type: "Collection / Deposit",
      reference: col.receiptNo || "-",
      amount: col.amount,
      status: col.status || "Paid",
      remarks: col.note || `Month: ${col.month}`,
    });
  }

  for (const wd of withdrawals) {
    transactions.push({
      date: wd.createdAt || new Date(),
      type: "Withdrawal",
      reference: wd.referenceId || "-",
      amount: -Math.abs(wd.amount),
      status: wd.status,
      remarks: wd.reason || wd.accountDetails || "Payout Request",
    });
  }

  for (const adj of adjustments) {
    transactions.push({
      date: adj.adjustmentDate || adj.createdAt,
      type: adj.adjustmentTypeName || "Adjustment",
      reference: adj.adjustmentId || "-",
      amount: adj.signedAmount !== undefined ? adj.signedAmount : adj.adjustmentAmount,
      status: "Completed",
      remarks: adj.remarks || "-",
    });
  }

  // Sort chronological descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format.toLowerCase() === "excel") {
    const filename = `member-${member.memberCode}-statement-${timestamp}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader("Cache-Control", "no-cache");

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
      useSharedStrings: false,
    });

    // Sheet 1: Master Profile & Balances Summary
    const profileSheet = workbook.addWorksheet("Profile & Balances");
    profileSheet.columns = [
      { width: 22 },
      { width: 35 },
      { width: 22 },
      { width: 35 },
    ];

    const hRow = profileSheet.addRow([`FRIENDS GOAL — MEMBER MASTER PROFILE (${member.memberCode})`]);
    hRow.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF046A38" } };
    hRow.commit();

    profileSheet.addRow([`Generated on: ${new Date().toLocaleString()}`]).commit();
    profileSheet.addRow([]).commit();

    // Personal details table
    profileSheet.addRow(["Full Name", member.fullName, "Member Code", member.memberCode]).commit();
    profileSheet.addRow(["Mobile Number", member.mobileNo, "Email Address", member.email || "N/A"]).commit();
    profileSheet.addRow(["NID / Passport", member.nidNo || "N/A", "Designation", member.designation || "General Member"]).commit();
    profileSheet.addRow(["Present Address", member.presentAddress || "N/A", "Account Status", String(member.status).toUpperCase()]).commit();
    profileSheet.addRow(["Nominee Name", member.nomineeName || "N/A", "Nominee Relation", member.nomineeRelation || "N/A"]).commit();
    const joinedDateStr = member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A";
    profileSheet.addRow(["Nominee NID", member.nomineeNid || "N/A", "Joined Date", joinedDateStr]).commit();

    profileSheet.addRow([]).commit();
    const balHRow = profileSheet.addRow(["FINANCIAL BALANCE SUMMARY", "AMOUNT (BDT)"]);
    balHRow.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF046A38" } };
    balHRow.commit();

    profileSheet.addRow(["Total Deposited", totalDeposit]).commit();
    profileSheet.addRow(["Profit Balance Earned", profitBalance]).commit();
    profileSheet.addRow(["Pending Withdrawals", pendingWithdrawals]).commit();
    profileSheet.addRow(["Current Due Amount", dueAmount]).commit();
    profileSheet.commit();

    // Sheet 2: Itemized Financial Transactions Ledger
    const txSheet = workbook.addWorksheet("Transaction Ledger", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    const txColumns: IExcelColumnConfig[] = [
      { header: "Date", key: "date", width: 16, alignment: "center", isDate: true },
      { header: "Transaction Type", key: "type", width: 24 },
      { header: "Ref / Receipt", key: "reference", width: 18, alignment: "center" },
      { header: "Amount (BDT)", key: "amount", width: 18, alignment: "right", isCurrency: true },
      { header: "Status", key: "status", width: 14, alignment: "center" },
      { header: "Remarks / Notes", key: "remarks", width: 40 },
    ];

    txSheet.columns = txColumns.map((c) => ({ key: c.key, width: c.width ?? 18 }));

    const txHRow = txSheet.addRow(txColumns.map((c) => c.header));
    txHRow.height = 24;
    txHRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF046A38" },
      };
      cell.font = { name: "Calibri", bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
    txHRow.commit();

    for (const tx of transactions) {
      const row = txSheet.addRow([
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.reference,
        tx.amount,
        tx.status,
        tx.remarks,
      ]);
      row.height = 20;
      row.getCell(4).numFmt = '"BDT "#,##0.00;[Red]"-BDT "#,##0.00;"BDT "0.00';
      row.commit();
    }

    txSheet.commit();
    await workbook.commit();
  } else {
    await streamMemberProfileToPdf(res, {
      filename: `member-${member.memberCode}-statement-${timestamp}.pdf`,
      data: {
        member,
        totalDeposit,
        profitBalance,
        pendingWithdrawals,
        dueAmount,
        transactions,
      },
    });
  }
};

export const MemberServices = {
  createMemberIntoDB,
  getAllMembersFromDB,
  getPublicCouncilMembersFromDB,
  getSingleMemberFromDB,
  updateMemberIntoDB,
  deleteMemberFromDB,
  getMemberDashboardSummaryFromDB,
  getMemberProfitBalanceFromDB,
  exportAllMembersFromDB,
  exportSingleMemberFromDB,
};

