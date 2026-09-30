import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { MemberControllers } from "./member.controller";
import { MemberValidation } from "./member.validation";

import { DisbursementControllers } from "../Disbursement/disbursement.controller";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// 1. Create a new member
router.post(
  "/",
  validateRequest(MemberValidation.createMemberValidationSchema),
  MemberControllers.createMember
);

// 2. Admin dashboard fetch with dynamic search & pagination
router.get("/", MemberControllers.getAllMembers);

// 3. Public API for public council page
router.get("/public-council", MemberControllers.getPublicCouncilMembers);

// 3.1 Personal Member Dashboard Summary
router.get(
  "/me/dashboard-summary",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.member, USER_ROLE.manager),
  MemberControllers.getMemberDashboardSummary
);

// 3.2 Personal Member Profit Balance
router.get(
  "/me/profit-balance",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.member, USER_ROLE.manager),
  MemberControllers.getMemberProfitBalance
);

// Member profit balance endpoint by memberId
router.get("/:memberId/profit-balance", MemberControllers.getMemberProfitBalance);

// 3.3 Export All Members Directory (Streaming PDF & Excel)
router.get("/export-all", MemberControllers.exportAllMembers);

// 3.4 Export Single Member Profile Card & Statement (Streaming PDF & Excel)
router.get("/:id/export", MemberControllers.exportSingleMember);

// 4. Fetch single member details
router.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  MemberControllers.getSingleMember
);

// 5. Update member profile & designation data
router.patch(
  "/:id",
  validateRequest(MemberValidation.updateMemberValidationSchema),
  MemberControllers.updateMember
);

// 6. Permanently delete a member
router.delete("/:id", MemberControllers.deleteMember);

export const MemberRoutes = router;
