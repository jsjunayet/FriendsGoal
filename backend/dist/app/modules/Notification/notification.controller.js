"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const notification_service_1 = require("./notification.service");
const getUserNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const userId = user?._id || user?.userId;
    const role = user?.role;
    const result = await notification_service_1.NotificationServices.getUserNotifications(userId, role, req.query);
    res.status(200).json({
        success: true,
        message: "Notifications retrieved successfully",
        ...result,
    });
});
const getPendingPopups = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const userId = user?._id || user?.userId;
    const result = await notification_service_1.NotificationServices.getPendingPopups(userId);
    res.status(200).json({
        success: true,
        message: "Pending popups retrieved successfully",
        data: result,
    });
});
const acknowledgeNotification = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const userId = user?._id || user?.userId;
    const result = await notification_service_1.NotificationServices.acknowledgeNotification(id, userId);
    res.status(200).json({
        success: true,
        message: "Notification acknowledged successfully",
        data: result,
    });
});
const sendDirectNotification = (0, catchAsync_1.default)(async (req, res) => {
    // Admin targeted notification
    const { recipientIds, title, message, channel, requiresAction } = req.body;
    const results = [];
    for (const recipientId of recipientIds) {
        const result = await notification_service_1.NotificationServices.createNotification({
            recipientId,
            title,
            message,
            type: "DIRECT_ADMIN_MSG",
            channel,
            requiresAction: !!requiresAction,
        });
        results.push(result);
    }
    res.status(201).json({
        success: true,
        message: "Direct notifications sent successfully",
        data: results,
    });
});
exports.NotificationControllers = {
    getUserNotifications,
    getPendingPopups,
    acknowledgeNotification,
    sendDirectNotification,
};
//# sourceMappingURL=notification.controller.js.map