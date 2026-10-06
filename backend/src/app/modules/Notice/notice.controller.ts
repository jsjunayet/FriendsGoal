import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { NoticeService } from "./notice.service";

const createNotice = catchAsync(async (req, res) => {
  const result = await NoticeService.createNoticeIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice created successfully",
    data: result,
  });
});

const getAllNotices = catchAsync(async (req, res) => {
  const result = await NoticeService.getAllNoticesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notices retrieved successfully",
    data: result,
  });
});

const getTickerNotices = catchAsync(async (req, res) => {
  const result = await NoticeService.getTickerNoticesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ticker notices retrieved successfully",
    data: result,
  });
});

const getSingleNotice = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await NoticeService.getSingleNoticeFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice retrieved successfully",
    data: result,
  });
});

const updateNotice = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await NoticeService.updateNoticeInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice updated successfully",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await NoticeService.deleteNoticeFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice deleted successfully",
    data: result,
  });
});

export const NoticeController = {
  createNotice,
  getAllNotices,
  getTickerNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
};
