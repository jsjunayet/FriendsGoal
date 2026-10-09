import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import type { INoticeSchedule } from "./noticeSchedule.interface";
import { NoticeSchedule } from "./noticeSchedule.model";
import { Member } from "../Member/member.model";

const createNoticeScheduleInDB = async (payload: INoticeSchedule) => {
  const result = await NoticeSchedule.create(payload);
  return result;
};

const getAllNoticeSchedulesFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.type && query.type !== "All" && query.type !== "All types") {
    filter.type = query.type;
  }

  if (query.audience && query.audience !== "All") {
    filter.audience = query.audience;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(String(query.search).trim(), "i");
    filter.$or = [
      { title: { $regex: searchRegex } },
      { message: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { agenda: { $regex: searchRegex } },
    ];
  }

  // Member-specific audience filtering when memberId query is passed
  if (query.memberId) {
    const member = await Member.findOne({
      $or: [
        { _id: query.memberId },
        { memberCode: query.memberId },
        { memberId: query.memberId },
      ],
    });

    const hasDue = (member?.dueAmount || 0) > 0;
    const memberCode = member?.memberCode || "";
    const memberIdStr = member?._id?.toString() || String(query.memberId);

    const allowedAudiences: string[] = ["All members", "Active members"];
    if (hasDue) {
      allowedAudiences.push("Due members");
    }

    const memberAudienceCondition = {
      $or: [
        { audience: { $in: allowedAudiences } },
        {
          audience: "Specific member",
          $or: [
            { targetMemberId: memberIdStr },
            { targetMemberCode: memberCode },
            { targetMemberId: String(query.memberId) },
          ],
        },
      ],
    };

    if (filter.$and && Array.isArray(filter.$and)) {
      filter.$and.push(memberAudienceCondition);
    } else {
      filter.$and = [memberAudienceCondition];
    }
  }

  const result = await NoticeSchedule.find(filter).sort({ createdAt: -1 });
  return result;
};

const getSingleNoticeScheduleFromDB = async (id: string) => {
  const result = await NoticeSchedule.findOne({ _id: id, isDeleted: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice schedule not found");
  }
  return result;
};

const updateNoticeScheduleInDB = async (
  id: string,
  payload: Partial<INoticeSchedule>
) => {
  const result = await NoticeSchedule.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice schedule not found");
  }

  return result;
};

const deleteNoticeScheduleFromDB = async (id: string) => {
  const result = await NoticeSchedule.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice schedule not found");
  }

  return result;
};

export const NoticeScheduleServices = {
  createNoticeScheduleInDB,
  getAllNoticeSchedulesFromDB,
  getSingleNoticeScheduleFromDB,
  updateNoticeScheduleInDB,
  deleteNoticeScheduleFromDB,
};
