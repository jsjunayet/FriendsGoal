"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisbursementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const disbursement_controller_1 = require("./disbursement.controller");
const disbursement_validation_1 = require("./disbursement.validation");
const security_1 = require("../../middlewares/security");
const router = express_1.default.Router();
/**
 * 1. POST /api/v1/disbursements
 * Process payout transaction
 */
router.post("/", security_1.financialMutationLimiter, (0, validateRequest_1.default)(disbursement_validation_1.DisbursementValidation.createDisbursementValidationSchema), disbursement_controller_1.DisbursementControllers.createDisbursement);
/**
 * 2. GET /api/v1/disbursements
 * Fetch payout audit list with date filtering
 */
router.get("/", (0, validateRequest_1.default)(disbursement_validation_1.DisbursementValidation.filterDisbursementsValidationSchema), disbursement_controller_1.DisbursementControllers.getDisbursements);
/**
 * 3. GET /api/v1/disbursements/member/:memberId/profit-balance
 */
router.get("/member/:memberId/profit-balance", disbursement_controller_1.DisbursementControllers.getMemberProfitBalance);
exports.DisbursementRoutes = router;
//# sourceMappingURL=disbursement.route.js.map