"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const notice_controller_1 = require("./notice.controller");
const router = (0, express_1.Router)();
// Public routes
router.get("/", notice_controller_1.NoticeController.getAllNotices);
router.get("/ticker", notice_controller_1.NoticeController.getTickerNotices);
router.get("/:id", notice_controller_1.NoticeController.getSingleNotice);
// Protected Admin / SuperAdmin routes
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.manager, "superadmin"), notice_controller_1.NoticeController.createNotice);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.manager, "superadmin"), notice_controller_1.NoticeController.updateNotice);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.manager, "superadmin"), notice_controller_1.NoticeController.deleteNotice);
exports.NoticeRoutes = router;
//# sourceMappingURL=notice.route.js.map