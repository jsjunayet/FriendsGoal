import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MemberServices } from "./member.service";

// 1. Create Member
const createMember = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberServices.createMemberIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Member registered successfully!",
    data: result,
  });
});

// 2. Get All Members (Admin dynamic search & pagination)
const getAllMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberServices.getAllMembersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Members fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// 3. Get Public Council Members
const getPublicCouncilMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberServices.getPublicCouncilMembersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Public council members fetched successfully!",
    data: result,
  });
});

// 4. Get Single Member Details
const getSingleMember = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await MemberServices.getSingleMemberFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member retrieved successfully!",
    data: result,
  });
});

// 5. Update Member Profile & Designation
const updateMember = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await MemberServices.updateMemberIntoDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member profile updated successfully!",
    data: result,
  });
});

// 6. Permanently Delete Member
const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await MemberServices.deleteMemberFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member deleted permanently!",
    data: result,
  });
});

// 7. Member Dashboard Summary (GET /api/v1/members/me/dashboard-summary)
const getMemberDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const identifier = user?.email || user?._id || user?.userId;
  const result = await MemberServices.getMemberDashboardSummaryFromDB(identifier);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member dashboard summary fetched successfully!",
    data: result,
  });
});

// 8. Member Live Profit Balance (GET /api/v1/members/me/profit-balance or /:id/profit-balance)
const getMemberProfitBalance = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const paramId = req.params.id || req.params.memberId;
  const identifier =
    paramId && paramId !== "me"
      ? paramId
      : user?.email || user?._id || user?.userId;

  const result = await MemberServices.getMemberProfitBalanceFromDB(identifier as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member profit balance fetched successfully!",
    data: result,
  });
});

// 9. Export All Members Directory (GET /api/v1/members/export-all?status=ACTIVE|INACTIVE|ALL&format=pdf|excel)
const exportAllMembers = catchAsync(async (req: Request, res: Response) => {
  await MemberServices.exportAllMembersFromDB(res, req.query);
});

// 10. Export Single Member Profile Card & Statement (GET /api/v1/members/:id/export?format=pdf|excel)
const exportSingleMember = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const format = (req.query.format as string) || "pdf";
  await MemberServices.exportSingleMemberFromDB(res, id as string, format);
});

export const MemberControllers = {
  createMember,
  getAllMembers,
  getPublicCouncilMembers,
  getSingleMember,
  updateMember,
  deleteMember,
  getMemberDashboardSummary,
  getMemberProfitBalance,
  exportAllMembers,
  exportSingleMember,
};

