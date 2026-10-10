"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const node_cron_1 = __importDefault(require("node-cron"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const member_model_1 = require("../Member/member.model");
const operation_model_1 = require("./operation.model");
const operation_utils_1 = require("./operation.utils");
const notification_service_1 = require("../Notification/notification.service");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
const cron_config_1 = require("../../config/cron.config");
const getDueListFromDB = async (query) => {
    const { searchByCodeOrName, status = "All", page = 1, limit = 6 } = query;
    const filter = { isDeleted: false };
    if (searchByCodeOrName) {
        filter.$or = [
            { memberCode: { $regex: searchByCodeOrName, $options: "i" } },
            { fullName: { $regex: searchByCodeOrName, $options: "i" } },
            { mobileNo: { $regex: searchByCodeOrName, $options: "i" } },
        ];
    }
    if (query.year) {
        const startOfYear = new Date(`${query.year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${query.year}-12-31T23:59:59.999Z`);
        filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
    }
    if (query.dateRange) {
        if (query.dateRange.length === 7 && query.dateRange.includes("-")) {
            const [yearStr, monthStr] = query.dateRange.split("-");
            const startOfMonth = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, 1, 0, 0, 0));
            const endOfMonth = new Date(Date.UTC(Number(yearStr), Number(monthStr), 0, 23, 59, 59, 999));
            filter.createdAt = {
                ...(filter.createdAt || {}),
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }
        else {
            const [start, end] = query.dateRange.split(" to ");
            if (start && end) {
                filter.createdAt = {
                    ...(filter.createdAt || {}),
                    $gte: new Date(`${start}T00:00:00.000Z`),
                    $lte: new Date(`${end}T23:59:59.999Z`),
                };
            }
        }
    }
    // Fetch all matching members to categorize by status
    const allMembers = await member_model_1.Member.find(filter).sort({ memberCode: 1 });
    let allCount = 0;
    let advanceCount = 0;
    let dueCount = 0;
    let zeroCount = 0;
    const computedItems = allMembers.map((m) => {
        const rawDue = m.dueAmount != null ? (m.dueAmount.toString ? m.dueAmount.toString() : m.dueAmount) : 0;
        const rawAdvance = m.savingsBalance != null ? (m.savingsBalance.toString ? m.savingsBalance.toString() : m.savingsBalance) : 0;
        const dueAmount = parseFloat(String(rawDue)) || 0;
        const advanceBalance = parseFloat(String(rawAdvance)) || 0;
        let itemStatus = "Zero";
        if (dueAmount > 0) {
            itemStatus = "Due";
            dueCount++;
        }
        else if (advanceBalance > 0) {
            itemStatus = "Advance";
            advanceCount++;
        }
        else {
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
const getFilteredDueListDataset = async (query) => {
    const result = await getDueListFromDB({
        ...query,
        page: 1,
        limit: 100000,
    });
    return result.data;
};
// ─── 3. Get Collections (Top 10 Global or Member-Specific Chronology) ──────────
const getCollectionsFromDB = async (memberId) => {
    // Scenario 1: Initial State (No Member Selected) -> Recent 10 collections globally
    if (!memberId || memberId === "all") {
        const recentCollections = await operation_model_1.Collection.find()
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
        member = await member_model_1.Member.findById(memberId);
    }
    else {
        member = await member_model_1.Member.findOne({ memberCode: memberId });
    }
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Selected member not found!");
    }
    const memberCollections = await operation_model_1.Collection.find({
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
const collectPaymentIntoDB = async (payload) => {
    const { memberId, amount, paymentMethod = "cash", note } = payload;
    let member = null;
    if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
        member = await member_model_1.Member.findById(memberId);
    }
    else {
        member = await member_model_1.Member.findOne({ memberCode: memberId });
    }
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member not found!");
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
        }
        else {
            const excess = amount - newDue;
            newDue = 0;
            newAdvance += excess;
        }
    }
    else {
        newAdvance += amount;
    }
    member.dueAmount = newDue;
    member.savingsBalance = newAdvance;
    await member.save();
    const receiptNo = (0, operation_utils_1.generateReceiptCode)();
    const currentMonth = payload.month || (0, operation_utils_1.formatMonthYear)(new Date());
    // Record Collection
    const collection = await operation_model_1.Collection.create({
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
    await operation_model_1.Ledger.create({
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
    // Record Audit Log
    await auditLog_service_1.AuditLogServices.createAuditLogInDB({
        adminName: "Super Admin",
        adminRole: "Super Admin",
        action: "Payment Recorded",
        target: `${member.fullName} (${member.memberCode})`,
        details: `Payment collection of ৳${Number(amount).toLocaleString()} recorded for ${currentMonth}. Receipt #${receiptNo}.`,
    }).catch((err) => console.error("Failed to record payment audit log:", err));
    const totalCollectionsCount = await operation_model_1.Collection.countDocuments();
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
    const cronConfig = (0, cron_config_1.getCronConfig)();
    console.log(`⏰ Initializing Due Generation Cron: ${cronConfig.dueGeneration.description} [Schedule: ${cronConfig.dueGeneration.schedule}]`);
    node_cron_1.default.schedule(cronConfig.dueGeneration.schedule, async () => {
        console.log(`⏰ Running Due Generation Cron Job (${cronConfig.dueGeneration.description})...`);
        try {
            const activeMembers = await member_model_1.Member.find({
                status: "active",
                isDeleted: false,
            });
            const currentMonth = cronConfig.isTestMode
                ? `${(0, operation_utils_1.formatMonthYear)(new Date())} (${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })})`
                : (0, operation_utils_1.formatMonthYear)(new Date());
            const chargeAmount = cronConfig.dueGeneration.amount ?? 1000;
            for (const member of activeMembers) {
                const previousDue = Number(member.dueAmount || 0);
                const previousAdvance = Number(member.savingsBalance || 0);
                let newDue = previousDue;
                let newAdvance = previousAdvance;
                let billStatus = "Due";
                // If advanceBalance >= 1000: Deduct 1000 from advanceBalance
                if (newAdvance >= chargeAmount) {
                    newAdvance -= chargeAmount;
                    billStatus = "Paid";
                }
                else {
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
                await operation_model_1.MonthlyBill.findOneAndUpdate({ member: member._id, billingMonth: currentMonth }, {
                    member: member._id,
                    memberCode: member.memberCode,
                    memberName: member.fullName,
                    billingMonth: currentMonth,
                    amount: chargeAmount,
                    status: billStatus,
                    paidAmount: billStatus === "Paid" ? chargeAmount : chargeAmount - (newDue - previousDue),
                    dueAmount: newDue,
                }, { upsert: true, new: true });
                // Ledger entry
                await operation_model_1.Ledger.create({
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
                if (billStatus === "Due" || newDue > 0) {
                    const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
              <h2 style="color: #DC2626;">New Monthly Due Allocated</h2>
              <p>Dear <strong>${member.fullName}</strong>,</p>
              <p>Your monthly fee of <strong>৳${chargeAmount}</strong> for <strong>${currentMonth}</strong> has been allocated.</p>
              <p>Your total outstanding due balance is now <strong style="color: #DC2626; font-size: 16px;">৳${newDue}</strong>.</p>
              <p>Please log in to your dashboard to acknowledge and proceed with payment.</p>
              <br/>
              <p style="color: #6B7280; font-size: 13px;">Thank you,<br/>Friends Goal Society</p>
            </div>
          `;
                    await notification_service_1.NotificationServices.createNotification({
                        recipientId: member._id,
                        title: "New Monthly Due Allocated",
                        message: htmlBody,
                        type: "DUE_ALERT",
                        channel: ["IN_APP", "EMAIL", "SMS"],
                        requiresAction: true,
                        metadata: { billingMonth: currentMonth, amount: chargeAmount, newDue },
                    }).catch((err) => console.error("Failed to send due allocation alert:", err));
                }
                else {
                    // Bill status is Paid (fully deducted from advance / savings balance)
                    const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
              <h2 style="color: #059669;">Monthly Fee Deducted from Advance</h2>
              <p>Dear <strong>${member.fullName}</strong>,</p>
              <p>Your monthly subscription fee of <strong>৳${chargeAmount}</strong> for <strong>${currentMonth}</strong> has been successfully deducted from your advance/savings balance.</p>
              <p>Your remaining advance balance is <strong>৳${newAdvance}</strong>.</p>
              <br/>
              <p style="color: #6B7280; font-size: 13px;">Thank you,<br/>Friends Goal Society</p>
            </div>
          `;
                    await notification_service_1.NotificationServices.createNotification({
                        recipientId: member._id,
                        title: "Monthly Fee Deducted from Advance",
                        message: htmlBody,
                        type: "GENERAL",
                        channel: ["IN_APP", "EMAIL"],
                        requiresAction: false,
                        metadata: { billingMonth: currentMonth, amount: chargeAmount, remainingAdvance: newAdvance },
                    }).catch((err) => console.error("Failed to send advance deduction alert:", err));
                }
            }
            console.log(`✅ Monthly Auto-Billing executed for ${activeMembers.length} active members.`);
        }
        catch (err) {
            console.error("❌ Error in Monthly Auto-Billing Cron:", err);
        }
    });
};
exports.OperationServices = {
    getDueListFromDB,
    getFilteredDueListDataset,
    getCollectionsFromDB,
    collectPaymentIntoDB,
    initMonthlyAutoBillingCron,
};
//# sourceMappingURL=operation.service.js.map