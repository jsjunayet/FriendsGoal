"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const notification_model_1 = require("./notification.model");
const socket_1 = require("../../../shared/socket");
const sendEmail_1 = require("../../../shared/sendEmail");
const user_model_1 = require("../User/user.model");
const member_model_1 = require("../Member/member.model");
const createNotification = async (payload) => {
    const result = await notification_model_1.Notification.create(payload);
    if (payload.channel?.includes("IN_APP")) {
        const io = (0, socket_1.getIO)();
        if (io) {
            if (payload.recipientId) {
                // Broadcast to specific user room if they are a regular user
                io.to(payload.recipientId.toString()).emit("new-notification", result);
            }
            if (payload.type === "DEPOSIT_SUCCESS" || payload.type === "WITHDRAWAL_REQUEST") {
                // Broadcast to admin room
                io.to("admin-room").emit("new-notification", result);
            }
        }
    }
    // Handle email sending
    if (payload.channel?.includes("EMAIL") && payload.recipientId) {
        const user = await member_model_1.Member.findById(payload.recipientId) || await user_model_1.User.findById(payload.recipientId);
        if (user && user.email) {
            // Check if message is already HTML formatted (very basic check)
            const isHtml = payload.message?.includes("<div") || payload.message?.includes("<p>");
            const html = isHtml ? payload.message : `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #00B074;">${payload.title}</h2>
          <p>${payload.message}</p>
        </div>
      `;
            await (0, sendEmail_1.sendEmail)(user.email, payload.title || "Notification", html, payload.message);
        }
    }
    // SMS handler can be added here
    return result;
};
const getUserNotifications = async (userId, role, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // Build filter query
    const filterQuery = { $or: [{ recipientId: userId }] };
    if (role === "admin" || role === "superAdmin") {
        filterQuery.$or.push({ type: "WITHDRAWAL_REQUEST" });
        filterQuery.$or.push({ type: "DEPOSIT_SUCCESS" });
    }
    const data = await notification_model_1.Notification.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await notification_model_1.Notification.countDocuments(filterQuery);
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) || 1 },
        data,
    };
};
const getPendingPopups = async (userId) => {
    const data = await notification_model_1.Notification.find({
        recipientId: userId,
        requiresAction: true,
        isAcknowledged: false,
    });
    return data;
};
const acknowledgeNotification = async (id, userId) => {
    const result = await notification_model_1.Notification.findOneAndUpdate({ _id: id, recipientId: userId }, { isAcknowledged: true, isRead: true }, { new: true });
    return result;
};
exports.NotificationServices = {
    createNotification,
    getUserNotifications,
    getPendingPopups,
    acknowledgeNotification,
};
//# sourceMappingURL=notification.service.js.map