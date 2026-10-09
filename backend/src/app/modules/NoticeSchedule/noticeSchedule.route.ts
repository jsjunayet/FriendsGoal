import { Router } from "express";
import { NoticeScheduleControllers } from "./noticeSchedule.controller";

const router = Router();

router.post("/", NoticeScheduleControllers.createNoticeSchedule);
router.get("/", NoticeScheduleControllers.getAllNoticeSchedules);
router.get("/:id", NoticeScheduleControllers.getSingleNoticeSchedule);
router.patch("/:id", NoticeScheduleControllers.updateNoticeSchedule);
router.delete("/:id", NoticeScheduleControllers.deleteNoticeSchedule);

export const NoticeScheduleRoutes = router;
