import express from "express";
import auth from "../../middlewares/auth";
import { NotificationControllers } from "./notification.controller";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

const ALL_ROLES = [
  USER_ROLE.superAdmin,
  USER_ROLE.admin,
  USER_ROLE.manager,
  USER_ROLE.member,
];

router.get(
  "/me",
  auth(...ALL_ROLES),
  NotificationControllers.getUserNotifications
);

router.get(
  "/me/pending-popups",
  auth(...ALL_ROLES),
  NotificationControllers.getPendingPopups
);

router.patch(
  "/mark-all-read",
  auth(...ALL_ROLES),
  NotificationControllers.markAllNotificationsAsRead
);

router.patch(
  "/:id/read",
  auth(...ALL_ROLES),
  NotificationControllers.markNotificationAsRead
);

router.patch(
  "/:id/acknowledge",
  auth(...ALL_ROLES),
  NotificationControllers.acknowledgeNotification
);

export const NotificationRoutes = router;

const adminRouter = express.Router();
adminRouter.post(
  "/send-direct",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  NotificationControllers.sendDirectNotification
);

export const AdminNotificationRoutes = adminRouter;
