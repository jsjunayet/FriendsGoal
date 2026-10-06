import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { GalleryService } from "./gallery.service";

const createGalleryItem = catchAsync(async (req, res) => {
  const result = await GalleryService.createGalleryItemIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gallery item created successfully",
    data: result,
  });
});

const getAllGalleryItems = catchAsync(async (req, res) => {
  const result = await GalleryService.getAllGalleryItemsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery items retrieved successfully",
    data: result,
  });
});

const getSingleGalleryItem = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await GalleryService.getSingleGalleryItemFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item retrieved successfully",
    data: result,
  });
});

const updateGalleryItem = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await GalleryService.updateGalleryItemInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item updated successfully",
    data: result,
  });
});

const deleteGalleryItem = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await GalleryService.deleteGalleryItemFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item deleted successfully",
    data: result,
  });
});

export const GalleryController = {
  createGalleryItem,
  getAllGalleryItems,
  getSingleGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
