import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { MarqueeServices } from "./marquee.service";

const getActiveMarqueeItems = catchAsync(async (req: Request, res: Response) => {
  const result = await MarqueeServices.getActiveMarqueeItemsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active marquee ticker items retrieved successfully",
    data: result,
  });
});

const getAllMarqueeItems = catchAsync(async (req: Request, res: Response) => {
  const onlyActive = req.query.active === "true";
  const result = await MarqueeServices.getAllMarqueeItemsFromDB(onlyActive);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marquee ticker items retrieved successfully",
    data: result,
  });
});

const createMarqueeItem = catchAsync(async (req: Request, res: Response) => {
  const result = await MarqueeServices.createMarqueeItemIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Marquee ticker item created successfully",
    data: result,
  });
});

const updateMarqueeItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await MarqueeServices.updateMarqueeItemInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marquee ticker item updated successfully",
    data: result,
  });
});

const deleteMarqueeItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await MarqueeServices.deleteMarqueeItemFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marquee ticker item deleted successfully",
    data: result,
  });
});

export const MarqueeControllers = {
  getActiveMarqueeItems,
  getAllMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
};
