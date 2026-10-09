"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const stats_controller_1 = require("./stats.controller");
const router = (0, express_1.Router)();
// Public route to fetch home page stats
router.get("/", stats_controller_1.StatController.getAllStats);
// Admin / SuperAdmin Protected routes
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), stats_controller_1.StatController.createStat);
router.put("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), stats_controller_1.StatController.bulkUpdateStats);
router.patch("/bulk", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), stats_controller_1.StatController.bulkUpdateStats);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), stats_controller_1.StatController.updateStat);
exports.StatRoutes = router;
//# sourceMappingURL=stats.route.js.map