import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StatService } from "./stats.service";

const getAllStats = catchAsync(async (req, res) => {
  const result = await StatService.getAllStatsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stat counters retrieved successfully",
    data: result,
  });
});

const updateStat = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await StatService.updateStatInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stat counter updated successfully",
    data: result,
  });
});

const createStat = catchAsync(async (req, res) => {
  const result = await StatService.createStatInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Stat counter created successfully",
    data: result,
  });
});

export const StatController = {
  getAllStats,
  updateStat,
  createStat,
};
