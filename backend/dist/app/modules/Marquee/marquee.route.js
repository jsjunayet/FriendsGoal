"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarqueeRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const marquee_controller_1 = require("./marquee.controller");
const router = (0, express_1.Router)();
// Public route for Home Page - fetches items where isActive: true
router.get("/active", marquee_controller_1.MarqueeControllers.getActiveMarqueeItems);
// Admin route - fetches all items (or query ?active=true)
router.get("/", marquee_controller_1.MarqueeControllers.getAllMarqueeItems);
// Admin / SuperAdmin CRUD routes
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), marquee_controller_1.MarqueeControllers.createMarqueeItem);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), marquee_controller_1.MarqueeControllers.updateMarqueeItem);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), marquee_controller_1.MarqueeControllers.deleteMarqueeItem);
exports.MarqueeRoutes = router;
//# sourceMappingURL=marquee.route.js.map