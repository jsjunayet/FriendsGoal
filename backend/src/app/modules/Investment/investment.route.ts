import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { InvestmentControllers } from "./investment.controller";
import { InvestmentValidation } from "./investment.validation";

const router = express.Router();

/**
 * 1. GET /api/v1/investments
 * Get all investment entries with search filter support (?search=)
 */
router.get("/", InvestmentControllers.getInvestments);

/**
 * 2. POST /api/v1/investments
 * Create new running investment entry
 */
router.post(
  "/",
  validateRequest(InvestmentValidation.createInvestmentValidationSchema),
  InvestmentControllers.createInvestment
);

/**
 * 3. PATCH /api/v1/investments/:id/close
 * Close an active investment: sets endDate to today, updates status to Closed, and marks isActive to false
 */
router.patch("/:id/close", InvestmentControllers.closeInvestment);

/**
 * 4. GET /api/v1/investments/:id
 * Get single investment details
 */
router.get("/:id", InvestmentControllers.getSingleInvestment);

/**
 * 5. PATCH /api/v1/investments/:id
 * Update investment details
 */
router.patch(
  "/:id",
  validateRequest(InvestmentValidation.updateInvestmentValidationSchema),
  InvestmentControllers.updateInvestment
);

/**
 * 6. DELETE /api/v1/investments/:id
 * Delete investment record
 */
router.delete("/:id", InvestmentControllers.deleteInvestment);

export const InvestmentRoutes = router;
