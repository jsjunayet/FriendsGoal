"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("./analytics.controller");
const router = express_1.default.Router();
router.get("/overview", analytics_controller_1.AnalyticsControllers.getOverview);
router.get("/monthly-collections", analytics_controller_1.AnalyticsControllers.getMonthlyCollections);
exports.AnalyticsRoutes = router;
//# sourceMappingURL=analytics.route.js.map