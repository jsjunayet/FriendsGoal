import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { NoticeController } from "./notice.controller";

const router = Router();

// Public routes
router.get("/", NoticeController.getAllNotices);
router.get("/ticker", NoticeController.getTickerNotices);
router.get("/:id", NoticeController.getSingleNotice);

// Protected Admin / SuperAdmin routes
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.manager, "superadmin" as any), NoticeController.createNotice);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.manager, "superadmin" as any), NoticeController.updateNotice);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.manager, "superadmin" as any), NoticeController.deleteNotice);

export const NoticeRoutes = router;
