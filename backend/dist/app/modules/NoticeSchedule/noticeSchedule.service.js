"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeScheduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const noticeSchedule_model_1 = require("./noticeSchedule.model");
const member_model_1 = require("../Member/member.model");
const createNoticeScheduleInDB = async (payload) => {
    const result = await noticeSchedule_model_1.NoticeSchedule.create(payload);
    return result;
};
const getAllNoticeSchedulesFromDB = async (query) => {
    const filter = { isDeleted: false };
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
        const member = await member_model_1.Member.findOne({
            $or: [
                { _id: query.memberId },
                { memberCode: query.memberId },
                { memberId: query.memberId },
            ],
        });
        const hasDue = (member?.dueAmount || 0) > 0;
        const memberCode = member?.memberCode || "";
        const memberIdStr = member?._id?.toString() || String(query.memberId);
        const allowedAudiences = ["All members", "Active members"];
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
        }
        else {
            filter.$and = [memberAudienceCondition];
        }
    }
    const result = await noticeSchedule_model_1.NoticeSchedule.find(filter).sort({ createdAt: -1 });
    return result;
};
const getSingleNoticeScheduleFromDB = async (id) => {
    const result = await noticeSchedule_model_1.NoticeSchedule.findOne({ _id: id, isDeleted: false });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice schedule not found");
    }
    return result;
};
const updateNoticeScheduleInDB = async (id, payload) => {
    const result = await noticeSchedule_model_1.NoticeSchedule.findOneAndUpdate({ _id: id, isDeleted: false }, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice schedule not found");
    }
    return result;
};
const deleteNoticeScheduleFromDB = async (id) => {
    const result = await noticeSchedule_model_1.NoticeSchedule.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notice schedule not found");
    }
    return result;
};
exports.NoticeScheduleServices = {
    createNoticeScheduleInDB,
    getAllNoticeSchedulesFromDB,
    getSingleNoticeScheduleFromDB,
    updateNoticeScheduleInDB,
    deleteNoticeScheduleFromDB,
};
//# sourceMappingURL=noticeSchedule.service.js.map