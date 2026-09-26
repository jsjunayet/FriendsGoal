"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const operation_controller_1 = require("./operation.controller");
const operation_validation_1 = require("./operation.validation");
const router = express_1.default.Router();
/**
 * 1. GET /api/v1/operations/due-list
 * Paginated receivables with status filters ('All', 'Advance', 'Due', 'Zero')
 */
router.get("/due-list", (0, validateRequest_1.default)(operation_validation_1.OperationValidation.dueListQueryValidationSchema), operation_controller_1.OperationControllers.getDueList);
/**
 * 2. GET /api/v1/operations/collections
 * Query parameter ?memberId=XXX. If memberId is missing, returns top 10 recent collections.
 */
router.get("/collections", operation_controller_1.OperationControllers.getCollections);
/**
 * 3. POST /api/v1/operations/collect
 * Save payment, update ledgers, generate receipt code (RCP-XXXXX)
 */
router.post("/collect", (0, validateRequest_1.default)(operation_validation_1.OperationValidation.collectPaymentValidationSchema), operation_controller_1.OperationControllers.collectPayment);
/**
 * 4. GET /api/v1/operations/export/pdf
 * Download dynamic branded PDF report based on applied UI filters
 */
router.get("/export/pdf", (0, validateRequest_1.default)(operation_validation_1.OperationValidation.exportQueryValidationSchema), operation_controller_1.OperationControllers.exportPdf);
/**
 * 5. GET /api/v1/operations/export/excel
 * Download formatted .xlsx workbook report based on applied UI filters (STRICT: NO CSV)
 */
router.get("/export/excel", (0, validateRequest_1.default)(operation_validation_1.OperationValidation.exportQueryValidationSchema), operation_controller_1.OperationControllers.exportExcel);
exports.OperationRoutes = router;
//# sourceMappingURL=operation.route.js.map