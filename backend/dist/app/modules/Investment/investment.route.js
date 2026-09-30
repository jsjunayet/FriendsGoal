"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const investment_controller_1 = require("./investment.controller");
const investment_validation_1 = require("./investment.validation");
const router = express_1.default.Router();
/**
 * 1. GET /api/v1/investments
 * Get all investment entries with search filter support (?search=)
 */
router.get("/", investment_controller_1.InvestmentControllers.getInvestments);
/**
 * 2. POST /api/v1/investments
 * Create new running investment entry
 */
router.post("/", (0, validateRequest_1.default)(investment_validation_1.InvestmentValidation.createInvestmentValidationSchema), investment_controller_1.InvestmentControllers.createInvestment);
/**
 * 3. PATCH /api/v1/investments/:id/close
 * Close an active investment: sets endDate to today, updates status to Closed, and marks isActive to false
 */
router.patch("/:id/close", investment_controller_1.InvestmentControllers.closeInvestment);
/**
 * 4. GET /api/v1/investments/:id
 * Get single investment details
 */
router.get("/:id", investment_controller_1.InvestmentControllers.getSingleInvestment);
/**
 * 5. PATCH /api/v1/investments/:id
 * Update investment details
 */
router.patch("/:id", (0, validateRequest_1.default)(investment_validation_1.InvestmentValidation.updateInvestmentValidationSchema), investment_controller_1.InvestmentControllers.updateInvestment);
/**
 * 6. DELETE /api/v1/investments/:id
 * Delete investment record
 */
router.delete("/:id", investment_controller_1.InvestmentControllers.deleteInvestment);
exports.InvestmentRoutes = router;
//# sourceMappingURL=investment.route.js.map