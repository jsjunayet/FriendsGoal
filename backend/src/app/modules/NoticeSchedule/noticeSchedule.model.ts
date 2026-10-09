import { Schema, model } from "mongoose";
import type {
  INoticeSchedule,
  NoticeScheduleModel,
} from "./noticeSchedule.interface";

const noticeScheduleSchema = new Schema<INoticeSchedule, NoticeScheduleModel>(
  {
    type: {
      type: String,
      enum: ["Fee Reminder", "Important Notice", "Invitation", "Meeting"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    audience: {
      type: String,
      enum: ["All members", "Active members", "Due members", "Specific member"],
      default: "All members",
      index: true,
    },
    targetMemberId: {
      type: String,
      default: "",
    },
    targetMemberName: {
      type: String,
      default: "",
    },
    targetMemberCode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Published", "Draft", "Archived"],
      default: "Published",
      index: true,
    },
    dueDate: {
      type: String,
      default: "",
    },
    feeAmount: {
      type: Number,
      default: 0,
    },
    feeCurrency: {
      type: String,
      default: "$",
    },
    paymentStatus: {
      type: String,
      default: "Payment due",
    },
    eventDate: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    agenda: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Friends Goal Administration",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NoticeSchedule = model<INoticeSchedule, NoticeScheduleModel>(
  "NoticeSchedule",
  noticeScheduleSchema
);
