"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRoutes = void 0;
const express_1 = require("express");
const report_controller_1 = require("./report.controller");
const router = (0, express_1.Router)();
// 1. Expense report export
router.get("/expense/export", report_controller_1.ReportControllers.exportExpenseReport);
// 2. Investments income report export
router.get("/investments/export", report_controller_1.ReportControllers.exportInvestmentReport);
// 3. Collection report export
router.get("/collection/export", report_controller_1.ReportControllers.exportCollectionReport);
// 4. Adjustments report export
router.get("/adjustments/export", report_controller_1.ReportControllers.exportAdjustmentReport);
exports.ReportRoutes = router;
//# sourceMappingURL=report.route.js.map