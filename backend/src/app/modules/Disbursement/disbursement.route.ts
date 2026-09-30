import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DisbursementControllers } from "./disbursement.controller";
import { DisbursementValidation } from "./disbursement.validation";

import { financialMutationLimiter } from "../../middlewares/security";

const router = express.Router();

/**
 * 1. POST /api/v1/disbursements
 * Process payout transaction
 */
router.post(
  "/",
  financialMutationLimiter,
  validateRequest(DisbursementValidation.createDisbursementValidationSchema),
  DisbursementControllers.createDisbursement
);

/**
 * 2. GET /api/v1/disbursements
 * Fetch payout audit list with date filtering
 */
router.get(
  "/",
  validateRequest(DisbursementValidation.filterDisbursementsValidationSchema),
  DisbursementControllers.getDisbursements
);

/**
 * 3. GET /api/v1/disbursements/member/:memberId/profit-balance
 */
router.get(
  "/member/:memberId/profit-balance",
  DisbursementControllers.getMemberProfitBalance
);

export const DisbursementRoutes = router;
