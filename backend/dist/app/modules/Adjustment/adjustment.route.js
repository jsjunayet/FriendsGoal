"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const adjustment_controller_1 = require("./adjustment.controller");
const adjustment_validation_1 = require("./adjustment.validation");
const security_1 = require("../../middlewares/security");
const router = express_1.default.Router();
/**
 * 1. POST /api/v1/adjustments
 * Process adjustment, apply ledger math, create audit record
 */
router.post("/", security_1.financialMutationLimiter, (0, validateRequest_1.default)(adjustment_validation_1.AdjustmentValidation.createAdjustmentValidationSchema), adjustment_controller_1.AdjustmentControllers.createAdjustment);
/**
 * 2. GET /api/v1/adjustments
 * Get filtered adjustments list with date range (fromDate, toDate) and search pagination
 */
router.get("/", (0, validateRequest_1.default)(adjustment_validation_1.AdjustmentValidation.filterAdjustmentsValidationSchema), adjustment_controller_1.AdjustmentControllers.getAdjustments);
/**
 * 3. GET /api/v1/adjustments/:id
 * Get single adjustment record
 */
router.get("/:id", adjustment_controller_1.AdjustmentControllers.getSingleAdjustment);
exports.AdjustmentRoutes = router;
//# sourceMappingURL=adjustment.route.js.map