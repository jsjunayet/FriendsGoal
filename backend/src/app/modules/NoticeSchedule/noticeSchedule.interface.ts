import type { Model } from "mongoose";

export type NoticeScheduleType =
  | "Fee Reminder"
  | "Important Notice"
  | "Invitation"
  | "Meeting";

export type NoticeAudience =
  | "All members"
  | "Active members"
  | "Due members"
  | "Specific member";
export type NoticeScheduleStatus = "Published" | "Draft" | "Archived";

export interface INoticeSchedule {
  _id?: string;
  type: NoticeScheduleType;
  title: string;
  message?: string;
  audience: NoticeAudience;
  status: NoticeScheduleStatus;

  // Targeting specific member
  targetMemberId?: string;
  targetMemberName?: string;
  targetMemberCode?: string;

  // Fee Reminder specific fields
  dueDate?: string;
  feeAmount?: number;
  feeCurrency?: string;
  paymentStatus?: string;

  // Invitation & Meeting specific fields
  eventDate?: string;
  time?: string;
  location?: string;
  agenda?: string;

  author?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NoticeScheduleModel = Model<INoticeSchedule>;
