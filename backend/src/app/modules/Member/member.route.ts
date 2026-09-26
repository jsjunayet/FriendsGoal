import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { MemberControllers } from "./member.controller";
import { MemberValidation } from "./member.validation";

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

// 4. Fetch single member details
router.get("/:id", MemberControllers.getSingleMember);

// 5. Update member profile & designation data
router.patch(
  "/:id",
  validateRequest(MemberValidation.updateMemberValidationSchema),
  MemberControllers.updateMember
);

// 6. Permanently delete a member
router.delete("/:id", MemberControllers.deleteMember);

export const MemberRoutes = router;
