import express from "express";
import { AnalyticsControllers } from "./analytics.controller";

const router = express.Router();

router.get("/overview", AnalyticsControllers.getOverview);
router.get("/monthly-collections", AnalyticsControllers.getMonthlyCollections);

export const AnalyticsRoutes = router;
