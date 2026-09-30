import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WithdrawalControllers } from "./withdrawal.controller";
import { WithdrawalValidation } from "./withdrawal.validation";
import { financialMutationLimiter } from "../../middlewares/security";

const router = express.Router();

/**
 * 1. POST /api/v1/withdrawals & POST /api/v1/withdrawals/request
 * Submit withdrawal request, set status to 'Pending', and hold profitBalance
 */
router.post(
  "/",
  financialMutationLimiter,
  validateRequest(WithdrawalValidation.createWithdrawalValidationSchema),
  WithdrawalControllers.createWithdrawal
);

router.post(
  "/request",
  financialMutationLimiter,
  validateRequest(WithdrawalValidation.createWithdrawalValidationSchema),
  WithdrawalControllers.createWithdrawal
);

/**
 * 2. GET /api/v1/withdrawals & GET /api/v1/admin/withdrawals
 * Fetch withdrawal audit list & filter by status
 */
router.get("/", WithdrawalControllers.getWithdrawals);

/**
 * 3. PATCH /api/v1/withdrawals/:id/respond
 * Admin approve or reject a withdrawal request
 */
router.patch(
  "/:id/respond",
  financialMutationLimiter,
  validateRequest(WithdrawalValidation.respondWithdrawalValidationSchema),
  WithdrawalControllers.respondWithdrawal
);

export const WithdrawalRoutes = router;
