import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OperationControllers } from "./operation.controller";
import { OperationValidation } from "./operation.validation";

const router = express.Router();

/**
 * 1. GET /api/v1/operations/due-list
 * Paginated receivables with status filters ('All', 'Advance', 'Due', 'Zero')
 */
router.get(
  "/due-list",
  validateRequest(OperationValidation.dueListQueryValidationSchema),
  OperationControllers.getDueList
);

/**
 * 2. GET /api/v1/operations/collections
 * Query parameter ?memberId=XXX. If memberId is missing, returns top 10 recent collections.
 */
router.get("/collections", OperationControllers.getCollections);

/**
 * 3. POST /api/v1/operations/collect
 * Save payment, update ledgers, generate receipt code (RCP-XXXXX)
 */
router.post(
  "/collect",
  validateRequest(OperationValidation.collectPaymentValidationSchema),
  OperationControllers.collectPayment
);

/**
 * 4. GET /api/v1/operations/export/pdf
 * Download dynamic branded PDF report based on applied UI filters
 */
router.get(
  "/export/pdf",
  validateRequest(OperationValidation.exportQueryValidationSchema),
  OperationControllers.exportPdf
);

/**
 * 5. GET /api/v1/operations/export/excel
 * Download formatted .xlsx workbook report based on applied UI filters (STRICT: NO CSV)
 */
router.get(
  "/export/excel",
  validateRequest(OperationValidation.exportQueryValidationSchema),
  OperationControllers.exportExcel
);

export const OperationRoutes = router;
