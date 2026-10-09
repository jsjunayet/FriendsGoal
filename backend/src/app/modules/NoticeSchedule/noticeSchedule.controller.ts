import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NoticeScheduleServices } from "./noticeSchedule.service";

const createNoticeSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeScheduleServices.createNoticeScheduleInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice schedule published successfully!",
    data: result,
  });
});

const getAllNoticeSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeScheduleServices.getAllNoticeSchedulesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice schedules retrieved successfully!",
    data: result,
  });
});

const getSingleNoticeSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NoticeScheduleServices.getSingleNoticeScheduleFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice schedule retrieved successfully!",
    data: result,
  });
});

const updateNoticeSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NoticeScheduleServices.updateNoticeScheduleInDB(
    id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice schedule updated successfully!",
    data: result,
  });
});

const deleteNoticeSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NoticeScheduleServices.deleteNoticeScheduleFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice schedule deleted successfully!",
    data: result,
  });
});

export const NoticeScheduleControllers = {
  createNoticeSchedule,
  getAllNoticeSchedules,
  getSingleNoticeSchedule,
  updateNoticeSchedule,
  deleteNoticeSchedule,
};
