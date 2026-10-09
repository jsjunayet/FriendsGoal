"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeScheduleRoutes = void 0;
const express_1 = require("express");
const noticeSchedule_controller_1 = require("./noticeSchedule.controller");
const router = (0, express_1.Router)();
router.post("/", noticeSchedule_controller_1.NoticeScheduleControllers.createNoticeSchedule);
router.get("/", noticeSchedule_controller_1.NoticeScheduleControllers.getAllNoticeSchedules);
router.get("/:id", noticeSchedule_controller_1.NoticeScheduleControllers.getSingleNoticeSchedule);
router.patch("/:id", noticeSchedule_controller_1.NoticeScheduleControllers.updateNoticeSchedule);
router.delete("/:id", noticeSchedule_controller_1.NoticeScheduleControllers.deleteNoticeSchedule);
exports.NoticeScheduleRoutes = router;
//# sourceMappingURL=noticeSchedule.route.js.map