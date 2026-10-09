import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { GoogleFormServices } from "./googleForm.service";

const createGoogleForm = catchAsync(async (req: Request, res: Response) => {
  const result = await GoogleFormServices.createGoogleFormInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Google Form saved successfully!",
    data: result,
  });
});

const getAllGoogleForms = catchAsync(async (req: Request, res: Response) => {
  const result = await GoogleFormServices.getAllGoogleFormsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Google Forms retrieved successfully!",
    data: result,
  });
});

const getSingleGoogleForm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoogleFormServices.getSingleGoogleFormFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Google Form retrieved successfully!",
    data: result,
  });
});

const updateGoogleForm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoogleFormServices.updateGoogleFormInDB(
    id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Google Form updated successfully!",
    data: result,
  });
});

const deleteGoogleForm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoogleFormServices.deleteGoogleFormFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Google Form deleted successfully!",
    data: result,
  });
});

export const GoogleFormControllers = {
  createGoogleForm,
  getAllGoogleForms,
  getSingleGoogleForm,
  updateGoogleForm,
  deleteGoogleForm,
};
