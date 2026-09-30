import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdjustmentControllers } from "./adjustment.controller";
import { AdjustmentValidation } from "./adjustment.validation";

import { financialMutationLimiter } from "../../middlewares/security";

const router = express.Router();

/**
 * 1. POST /api/v1/adjustments
 * Process adjustment, apply ledger math, create audit record
 */
router.post(
  "/",
  financialMutationLimiter,
  validateRequest(AdjustmentValidation.createAdjustmentValidationSchema),
  AdjustmentControllers.createAdjustment
);

/**
 * 2. GET /api/v1/adjustments
 * Get filtered adjustments list with date range (fromDate, toDate) and search pagination
 */
router.get(
  "/",
  validateRequest(AdjustmentValidation.filterAdjustmentsValidationSchema),
  AdjustmentControllers.getAdjustments
);

/**
 * 3. GET /api/v1/adjustments/:id
 * Get single adjustment record
 */
router.get("/:id", AdjustmentControllers.getSingleAdjustment);

export const AdjustmentRoutes = router;
