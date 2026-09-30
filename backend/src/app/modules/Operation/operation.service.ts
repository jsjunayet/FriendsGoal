import httpStatus from "http-status";
import nodeCron from "node-cron";
import AppError from "../../errors/AppError";
import { Member } from "../Member/member.model";
import { Collection, MonthlyBill, Ledger } from "./operation.model";
import { generateReceiptCode, formatMonthYear } from "./operation.utils";
import { NotificationServices } from "../Notification/notification.service";
import { IDueListItem, IExportFilterOptions } from "./operation.interface";

// ─── 1. Get Due List (Paginated Receivables with Status Filters) ───────────────

interface DueListQueryParams {
  searchByCodeOrName?: string;
  year?: string;
  status?: "All" | "Advance" | "Due" | "Zero";
  dateRange?: string;
  page?: number | string;
  limit?: number | string;
}

const getDueListFromDB = async (query: DueListQueryParams) => {
  const { searchByCodeOrName, status = "All", page = 1, limit = 6 } = query;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (searchByCodeOrName) {
    filter.$or = [
      { memberCode: { $regex: searchByCodeOrName, $options: "i" } },
      { fullName: { $regex: searchByCodeOrName, $options: "i" } },
      { mobileNo: { $regex: searchByCodeOrName, $options: "i" } },
    ];
  }

  // Fetch all matching members to categorize by status
  const allMembers = await Member.find(filter).sort({ memberCode: 1 });

  let allCount = 0;
  let advanceCount = 0;
  let dueCount = 0;
  let zeroCount = 0;

  const computedItems: IDueListItem[] = allMembers.map((m) => {
    const dueAmount = Number(m.dueAmount || 0);
    const advanceBalance = Number(m.savingsBalance || 0);

    let itemStatus: "Advance" | "Due" | "Zero" = "Zero";
    if (dueAmount > 0) {
      itemStatus = "Due";
      dueCount++;
    } else if (advanceBalance > 0) {
      itemStatus = "Advance";
      advanceCount++;
    } else {
      itemStatus = "Zero";
      zeroCount++;
    }
    allCount++;

    return {
      id: m._id.toString(),
      memberCode: m.memberCode,
      memberName: m.fullName,
      mobileNo: m.mobileNo,
      dueAmount,
      advanceBalance,
      status: itemStatus,
    };
  });

  // Filter by status pill ('All', 'Advance', 'Due', 'Zero')
  let filteredItems = computedItems;
  if (status && status !== "All") {
    filteredItems = computedItems.filter((item) => item.status === status);
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 6;
  const total = filteredItems.length;
  const totalPage = Math.ceil(total / limitNum) || 1;
  const skip = (pageNum - 1) * limitNum;
  const paginatedData = filteredItems.slice(skip, skip + limitNum);

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage,
      allCount,
      advanceCount,
      dueCount,
      zeroCount,
    },
    data: paginatedData,
  };
};

// ─── 2. Get Filtered Dataset for Exports (No pagination cap) ───────────────────

const getFilteredDueListDataset = async (query: IExportFilterOptions): Promise<IDueListItem[]> => {
  const result = await getDueListFromDB({
    ...query,
    page: 1,
    limit: 100000,
  });
  return result.data;
};

// ─── 3. Get Collections (Top 10 Global or Member-Specific Chronology) ──────────

const getCollectionsFromDB = async (memberId?: string) => {
  // Scenario 1: Initial State (No Member Selected) -> Recent 10 collections globally
  if (!memberId || memberId === "all") {
    const recentCollections = await Collection.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("member", "fullName memberCode mobileNo");

    return {
      memberInfo: null,
      dueBalance: 0,
      advanceBalance: 0,
      data: recentCollections,
      collections: recentCollections,
    };
  }

  // Scenario 2: Member Selected State -> Real-time balance and member history
  let member = null;
  if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(memberId);
  } else {
    member = await Member.findOne({ memberCode: memberId });
  }

  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Selected member not found!");
  }

  const memberCollections = await Collection.find({
    $or: [{ member: member._id }, { memberCode: member.memberCode }],
  }).sort({ createdAt: -1 });

  return {
    memberInfo: {
      id: member._id,
      memberCode: member.memberCode,
      memberName: member.fullName,
      mobileNo: member.mobileNo,
      dueAmount: member.dueAmount || 0,
      savingsBalance: member.savingsBalance || 0,
      advanceBalance: member.savingsBalance || 0,
      totalDeposit: member.totalDeposit || 0,
    },
    dueBalance: member.dueAmount || 0,
    advanceBalance: member.savingsBalance || 0,
    data: memberCollections,
    collections: memberCollections,
  };
};

// ─── 4. Collect Payment Execution ─────────────────────────────────────────────

interface CollectPaymentPayload {
  memberId: string;
  amount: number;
  paymentMethod?: "cash" | "bank" | "mobile_banking";
  month?: string;
  note?: string;
}

const collectPaymentIntoDB = async (payload: CollectPaymentPayload) => {
  const { memberId, amount, paymentMethod = "cash", note } = payload;

  let member = null;
  if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(memberId);
  } else {
    member = await Member.findOne({ memberCode: memberId });
  }

  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  const previousDue = Number(member.dueAmount || 0);
  const previousAdvance = Number(member.savingsBalance || 0);
  let newDue = previousDue;
  let newAdvance = previousAdvance;

  // 1. lifetime totalDeposit ALWAYS increases on new collection
  member.totalDeposit = Number(member.totalDeposit || 0) + Number(amount);

  // 2. Financial Math: Clears existing dues first; excess routes to advanceBalance
  if (newDue > 0) {
    if (amount <= newDue) {
      newDue -= amount;
    } else {
      const excess = amount - newDue;
      newDue = 0;
      newAdvance += excess;
    }
  } else {
    newAdvance += amount;
  }

  member.dueAmount = newDue;
  member.savingsBalance = newAdvance;
  await member.save();

  const receiptNo = generateReceiptCode();
  const currentMonth = payload.month || formatMonthYear(new Date());

  // Record Collection
  const collection = await Collection.create({
    member: member._id,
    memberCode: member.memberCode,
    memberName: member.fullName,
    amount,
    receiptNo,
    month: currentMonth,
    paymentDate: new Date(),
    paymentMethod,
    status: "Paid",
    note: note || `Payment of ${amount} BDT recorded.`,
  });

  // Record Ledger Transaction
  await Ledger.create({
    member: member._id,
    memberCode: member.memberCode,
    type: "deposit",
    amount,
    previousDue,
    newDue,
    previousAdvance,
    newAdvance,
    description: `Payment of ${amount} BDT received. Receipt: ${receiptNo}`,
  });

  const totalCollectionsCount = await Collection.countDocuments();

  return {
    receiptNo,
    amountPaid: amount,
    amount,
    member: `${member.memberCode} - ${member.fullName}`,
    memberCode: member.memberCode,
    memberName: member.fullName,
    paymentDate: currentMonth,
    date: currentMonth,
    entryNo: totalCollectionsCount,
    status: "Paid",
    dueBalance: newDue,
    advanceBalance: newAdvance,
    newDueAmount: newDue,
    newAdvanceBalance: newAdvance,
    newTotalDeposit: Number(member.totalDeposit || 0),
    collection,
  };
};

// ─── 5. Subscription Engine: Monthly Auto-Billing Cron (node-cron) ────────────

const initMonthlyAutoBillingCron = () => {
  // Monthly Auto-Billing Cron (runs on 1st of every month at midnight)
  nodeCron.schedule("0 0 1 * *", async () => {
    console.log("⏰ Running Monthly Auto-Billing Cron Job...");
    try {
      const activeMembers = await Member.find({
        status: "active",
        isDeleted: false,
      });

      const currentMonth = formatMonthYear(new Date());
      const chargeAmount = 1000;

      for (const member of activeMembers) {
        const previousDue = Number(member.dueAmount || 0);
        const previousAdvance = Number(member.savingsBalance || 0);
        let newDue = previousDue;
        let newAdvance = previousAdvance;
        let billStatus: "Paid" | "Due" = "Due";

        // If advanceBalance >= 1000: Deduct 1000 from advanceBalance
        if (newAdvance >= chargeAmount) {
          newAdvance -= chargeAmount;
          billStatus = "Paid";
        } else {
          // Else: Deduct remaining advance, add shortfall to dueAmount
          const shortfall = chargeAmount - newAdvance;
          newAdvance = 0;
          newDue += shortfall;
          billStatus = "Due";
        }

        member.dueAmount = newDue;
        member.savingsBalance = newAdvance;
        await member.save();

        // Create MonthlyBill
        await MonthlyBill.findOneAndUpdate(
          { member: member._id, billingMonth: currentMonth },
          {
            member: member._id,
            memberCode: member.memberCode,
            memberName: member.fullName,
            billingMonth: currentMonth,
            amount: chargeAmount,
            status: billStatus,
            paidAmount: billStatus === "Paid" ? chargeAmount : chargeAmount - (newDue - previousDue),
            dueAmount: newDue,
          },
          { upsert: true, new: true }
        );

        // Ledger entry
        await Ledger.create({
          member: member._id,
          memberCode: member.memberCode,
          type: "monthly_fee",
          amount: chargeAmount,
          previousDue,
          newDue,
          previousAdvance,
          newAdvance,
          description: `Monthly fee charge of ${chargeAmount} BDT for ${currentMonth}`,
        });

        if (billStatus === "Due") {
          const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
              <h2 style="color: #F59E0B;">New Monthly Due Allocated</h2>
              <p>Dear <strong>${member.fullName}</strong>,</p>
              <p>Your monthly due of <strong>৳${chargeAmount}</strong> for <strong>${currentMonth}</strong> has been allocated.</p>
              <p>Your new total due balance is <strong>৳${newDue}</strong>.</p>
              <p>Please log in to the portal to acknowledge and proceed with payment.</p>
            </div>
          `;

          await NotificationServices.createNotification({
            recipientId: member._id,
            title: "New Monthly Due Allocated",
            message: htmlBody,
            type: "DUE_ALERT",
            channel: ["IN_APP", "EMAIL", "SMS"],
            requiresAction: true,
            metadata: { billingMonth: currentMonth, amount: chargeAmount, newDue },
          }).catch((err) => console.error("Failed to send due allocation alert", err));
        }
      }
      console.log(`✅ Monthly Auto-Billing executed for ${activeMembers.length} active members.`);
    } catch (err) {
      console.error("❌ Error in Monthly Auto-Billing Cron:", err);
    }
  });
};

export const OperationServices = {
  getDueListFromDB,
  getFilteredDueListDataset,
  getCollectionsFromDB,
  collectPaymentIntoDB,
  initMonthlyAutoBillingCron,
};
