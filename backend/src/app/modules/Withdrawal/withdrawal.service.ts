import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Withdrawal, generateWithdrawalReferenceId } from "./withdrawal.model";
import { Member } from "../Member/member.model";
import { AuditLogServices } from "../AuditLog/auditLog.service";
import {
  ICreateWithdrawalPayload,
  IRespondWithdrawalPayload,
} from "./withdrawal.interface";
import { NotificationServices } from "../Notification/notification.service";





/**
 * 1. Create a Withdrawal Request & Hold/Deduct from Profit Balance
 */
const createWithdrawalRequestInDB = async (payload: ICreateWithdrawalPayload) => {
  const { memberId, amount, method, accountDetails, reason } = payload;
  const withdrawAmount = Number(amount);

  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Withdrawal amount must be a positive number"
    );
  }

  const member = await Member.findById(memberId);
  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member record not found");
  }

  const rawDeposit = member.totalDeposit;
  const availableDeposit = rawDeposit != null ? parseFloat(rawDeposit.toString()) : 0.0;

  const rawPending = member.pendingWithdrawal;
  const pendingWithdrawal = rawPending != null ? parseFloat(rawPending.toString()) : 0.0;

  const maxAllowable = Math.max(0, availableDeposit - pendingWithdrawal);

  if (withdrawAmount > availableDeposit || withdrawAmount > maxAllowable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can only request withdrawal from your total deposit amount (৳ ${availableDeposit.toLocaleString()}). Profit balance cannot be withdrawn.`
    );
  }

  const depositDeduction = withdrawAmount;
  const profitDeduction = 0;

  const referenceId = generateWithdrawalReferenceId();

  const docData: any = {
    referenceId,
    memberId: member._id,
    memberName: member.fullName,
    memberCode: member.memberCode,
    amount: withdrawAmount,
    status: "Pending",
    method: method || "Mobile Banking",
    accountDetails: accountDetails || "",
    reason: reason || "Personal expenses",
    submittedAt: new Date(),
  };

  // Attempt Transaction with Session
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const withdrawalDoc = new Withdrawal(docData);
    const created = await withdrawalDoc.save({ session });

    // Atomic Ledger Update - strictly deducts from totalDeposit, holds in pendingWithdrawal
    await Member.findByIdAndUpdate(
      member._id,
      {
        $inc: {
          totalDeposit: -depositDeduction,
          pendingWithdrawal: withdrawAmount,
        },
      },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    
    // Notify Admin via Socket/DB
    NotificationServices.createNotification({
      recipientId: member._id,
      title: "New Withdrawal Request",
      message: `Member ${member.fullName} requested a withdrawal of ৳${withdrawAmount.toLocaleString()} from deposit.`,
      type: "WITHDRAWAL_REQUEST",
      channel: ["IN_APP"],
      metadata: { withdrawalId: created._id },
    }).catch(err => console.error("Failed to notify admins of withdrawal request:", err));

    return {
      withdrawal: created,
      profitDeduction: 0,
      depositDeduction,
      remainingDeposit: Math.max(0, availableDeposit - withdrawAmount),
    };
  } catch (error: any) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }

    if (
      error?.message?.includes("replica set") ||
      error?.message?.includes("Transaction numbers")
    ) {
      const withdrawalDoc = new Withdrawal(docData);
      const created = await withdrawalDoc.save();

      // Fallback Atomic Ledger Update if replica set is not configured
      await Member.findByIdAndUpdate(member._id, {
        $inc: {
          totalDeposit: -depositDeduction,
          pendingWithdrawal: withdrawAmount,
        },
      });

      // Notify Admin via Socket/DB
      NotificationServices.createNotification({
        recipientId: member._id,
        title: "New Withdrawal Request",
        message: `Member ${member.fullName} requested a withdrawal of ৳${withdrawAmount.toLocaleString()} from deposit.`,
        type: "WITHDRAWAL_REQUEST",
        channel: ["IN_APP"],
        metadata: { withdrawalId: created._id },
      }).catch(err => console.error("Failed to notify admins of withdrawal request:", err));

      return {
        withdrawal: created,
        profitDeduction: 0,
        depositDeduction,
        remainingDeposit: Math.max(0, availableDeposit - withdrawAmount),
      };
    }

    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

/**
 * 2. Admin Respond: Approve or Reject a Withdrawal Request
 * PATCH /api/v1/withdrawals/:id/respond
 */
const respondWithdrawalInDB = async (
  id: string,
  payload: IRespondWithdrawalPayload,
  adminUser?: any
) => {
  const isApproved =
    payload.action === "approve" || payload.action === "Approved";
  const isRejected =
    payload.action === "reject" || payload.action === "Rejected";

  if (!isApproved && !isRejected) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Action must be either 'approve' or 'reject'"
    );
  }

  // Find withdrawal by _id or referenceId
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : {
        $or: [
          { referenceId: id },
          { referenceId: `WD-${id}` },
          { referenceId: id.replace(/^WD-/, "") },
        ],
      };

  const withdrawal = await Withdrawal.findOne(query);
  if (!withdrawal) {
    throw new AppError(httpStatus.NOT_FOUND, "Withdrawal request not found");
  }

  if (withdrawal.status !== "Pending") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot respond to withdrawal request already marked as ${withdrawal.status}`
    );
  }

  const member = await Member.findById(withdrawal.memberId);
  const memberName = member?.fullName || withdrawal.memberName;
  const adminName =
    payload.reviewerName ||
    adminUser?.name ||
    adminUser?.email?.split("@")[0] ||
    (isApproved ? "Rania Islam" : "Tarek Farouq");

  const adminAvatar = adminName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const updatedStatus = isApproved ? "Approved" : "Rejected";
  const adminNote = payload.adminNote?.trim();

  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // 1. Update Withdrawal Request
    withdrawal.status = updatedStatus;
    if (adminNote) {
      withdrawal.adminNote = adminNote;
    }
    withdrawal.reviewedByName = adminName;
    withdrawal.reviewedAt = new Date();
    if (adminUser?._id && mongoose.Types.ObjectId.isValid(adminUser._id)) {
      withdrawal.reviewedBy = adminUser._id;
    }
    await withdrawal.save({ session });

    // 2. Member Ledger balance adjustment
    if (isApproved) {
      // Clear held pending amount, increment totalWithdrawn
      if (withdrawal.memberId) {
        await Member.findByIdAndUpdate(
          withdrawal.memberId,
          {
            $inc: {
              totalWithdrawn: withdrawal.amount,
              pendingWithdrawal: -withdrawal.amount,
            },
          },
          { session }
        );
      }
    } else {
      // Reject: refund held funds back to totalDeposit and clear pending
      if (withdrawal.memberId) {
        await Member.findByIdAndUpdate(
          withdrawal.memberId,
          {
            $inc: {
              totalDeposit: withdrawal.amount,
              pendingWithdrawal: -withdrawal.amount,
            },
          },
          { session }
        );
      }
    }

    await session.commitTransaction();
  } catch (error: any) {
    if (session) {
      await session.abortTransaction().catch(() => {});
    }

    if (
      error?.message?.includes("replica set") ||
      error?.message?.includes("Transaction numbers")
    ) {
      withdrawal.status = updatedStatus;
      if (adminNote) {
        withdrawal.adminNote = adminNote;
      }
      withdrawal.reviewedByName = adminName;
      withdrawal.reviewedAt = new Date();
      await withdrawal.save();

      if (isApproved) {
        if (withdrawal.memberId) {
          await Member.findByIdAndUpdate(withdrawal.memberId, {
            $inc: {
              totalWithdrawn: withdrawal.amount,
              pendingWithdrawal: -withdrawal.amount,
            },
          });
        }
      } else {
        if (withdrawal.memberId) {
          await Member.findByIdAndUpdate(withdrawal.memberId, {
            $inc: {
              totalDeposit: withdrawal.amount,
              pendingWithdrawal: -withdrawal.amount,
            },
          });
        }
      }
    } else {
      throw error;
    }
  } finally {
    if (session) {
      session.endSession();
    }
  }

  // 3. Create AuditLog entry matching specifications
  if (isApproved) {
    await AuditLogServices.createAuditLogInDB({
      adminName,
      adminAvatar,
      action: "Withdrawal Approved",
      target: memberName,
      details: `Withdrawal request ${withdrawal.referenceId} approved for ${withdrawal.amount.toLocaleString()}.`,
    });
  } else {
    await AuditLogServices.createAuditLogInDB({
      adminName,
      adminAvatar,
      action: "Withdrawal Rejected",
      target: memberName,
      details: `Request ${withdrawal.referenceId} rejected — ${adminNote || "insufficient profit"}.`,
    });
  }

  return withdrawal;
};

/**
 * 3. Get All Withdrawal Requests with counts & pagination
 */
const getWithdrawalsFromDB = async (query: Record<string, any>) => {
  const filter: Record<string, any> = {};
  if (query.memberId) {
    filter.memberId = new mongoose.Types.ObjectId(query.memberId);
  }
  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }
  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [
      { referenceId: searchRegex },
      { memberName: searchRegex },
      { memberCode: searchRegex },
      { accountDetails: searchRegex },
      { reason: searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [data, total, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      Withdrawal.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData"
          }
        },
        {
          $addFields: {
            member: { $arrayElemAt: ["$memberData", 0] }
          }
        },
        {
          $project: {
            memberData: 0 // exclude raw lookup array
          }
        }
      ]),
      Withdrawal.countDocuments(filter),
      Withdrawal.countDocuments({ status: "Pending" }),
      Withdrawal.countDocuments({ status: "Approved" }),
      Withdrawal.countDocuments({ status: "Rejected" }),
    ]);

  const allCount = pendingCount + approvedCount + rejectedCount;

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1,
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    },
    data,
  };
};

export const WithdrawalServices = {
  createWithdrawalRequestInDB,
  respondWithdrawalInDB,
  getWithdrawalsFromDB,
};
