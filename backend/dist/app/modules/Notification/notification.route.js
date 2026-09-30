"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationRoutes = exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controller_1 = require("./notification.controller");
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.get("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), notification_controller_1.NotificationControllers.getUserNotifications);
router.get("/me/pending-popups", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), notification_controller_1.NotificationControllers.getPendingPopups);
router.patch("/:id/acknowledge", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), notification_controller_1.NotificationControllers.acknowledgeNotification);
exports.NotificationRoutes = router;
const adminRouter = express_1.default.Router();
adminRouter.post("/send-direct", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), notification_controller_1.NotificationControllers.sendDirectNotification);
exports.AdminNotificationRoutes = adminRouter;
//# sourceMappingURL=notification.route.js.map