"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const withdrawal_controller_1 = require("./withdrawal.controller");
const withdrawal_validation_1 = require("./withdrawal.validation");
const security_1 = require("../../middlewares/security");
const router = express_1.default.Router();
/**
 * 1. POST /api/v1/withdrawals & POST /api/v1/withdrawals/request
 * Submit withdrawal request, set status to 'Pending', and hold profitBalance
 */
router.post("/", security_1.financialMutationLimiter, (0, validateRequest_1.default)(withdrawal_validation_1.WithdrawalValidation.createWithdrawalValidationSchema), withdrawal_controller_1.WithdrawalControllers.createWithdrawal);
router.post("/request", security_1.financialMutationLimiter, (0, validateRequest_1.default)(withdrawal_validation_1.WithdrawalValidation.createWithdrawalValidationSchema), withdrawal_controller_1.WithdrawalControllers.createWithdrawal);
/**
 * 2. GET /api/v1/withdrawals & GET /api/v1/admin/withdrawals
 * Fetch withdrawal audit list & filter by status
 */
router.get("/", withdrawal_controller_1.WithdrawalControllers.getWithdrawals);
/**
 * 3. PATCH /api/v1/withdrawals/:id/respond
 * Admin approve or reject a withdrawal request
 */
router.patch("/:id/respond", security_1.financialMutationLimiter, (0, validateRequest_1.default)(withdrawal_validation_1.WithdrawalValidation.respondWithdrawalValidationSchema), withdrawal_controller_1.WithdrawalControllers.respondWithdrawal);
exports.WithdrawalRoutes = router;
//# sourceMappingURL=withdrawal.route.js.map