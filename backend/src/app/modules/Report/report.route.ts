import { Router } from "express";
import { ReportControllers } from "./report.controller";

const router = Router();

// 1. Expense report export
router.get("/expense/export", ReportControllers.exportExpenseReport);

// 2. Investments income report export
router.get("/investments/export", ReportControllers.exportInvestmentReport);

// 3. Collection report export
router.get("/collection/export", ReportControllers.exportCollectionReport);

// 4. Adjustments report export
router.get("/adjustments/export", ReportControllers.exportAdjustmentReport);

export const ReportRoutes = router;
