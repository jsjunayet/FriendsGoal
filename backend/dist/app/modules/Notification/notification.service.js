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
    // Resolve member if available for multi-room broadcasting & email lookup
    let member = null;
    if (payload.recipientId) {
        const idStr = String(payload.recipientId);
        if (idStr.match(/^[0-9a-fA-F]{24}$/)) {
            member = await member_model_1.Member.findById(idStr);
        }
        else {
            member = await member_model_1.Member.findOne({
                $or: [{ memberCode: idStr }, { email: idStr }],
            });
        }
    }
    if (payload.channel?.includes("IN_APP")) {
        const io = (0, socket_1.getIO)();
        if (io) {
            if (payload.recipientId) {
                const recipientRoom = payload.recipientId.toString();
                // Emit both naming variants for bulletproof frontend compatibility
                io.to(recipientRoom).emit("new-notification", result);
                io.to(recipientRoom).emit("new_notification", result);
                // Also emit to memberCode room if different from recipientRoom
                if (member?.memberCode && member.memberCode !== recipientRoom) {
                    io.to(member.memberCode).emit("new-notification", result);
                    io.to(member.memberCode).emit("new_notification", result);
                }
                // Emit updated unread count to recipient
                const unreadCount = await notification_model_1.Notification.countDocuments({
                    $or: [
                        { recipientId: payload.recipientId },
                        ...(member ? [{ recipientId: member._id }] : []),
                    ],
                    isRead: false,
                });
                io.to(recipientRoom).emit("unread_count_updated", { unreadCount });
                if (member?.memberCode && member.memberCode !== recipientRoom) {
                    io.to(member.memberCode).emit("unread_count_updated", { unreadCount });
                }
            }
            // Broadcast to admin-room for admins to see live system activity
            io.to("admin-room").emit("new-notification", result);
            io.to("admin-room").emit("new_notification", result);
            const adminUnreadCount = await notification_model_1.Notification.countDocuments({
                $or: [
                    {
                        type: {
                            $in: [
                                "WITHDRAWAL_REQUEST",
                                "DEPOSIT_SUCCESS",
                                "DUE_ALERT",
                                "DIRECT_ADMIN_MSG",
                                "SUPERADMIN_SECURITY_ALERT",
                                "GENERAL",
                            ],
                        },
                    },
                ],
                isRead: false,
            });
            io.to("admin-room").emit("unread_count_updated", { unreadCount: adminUnreadCount });
        }
    }
    // Handle email sending
    if (payload.channel?.includes("EMAIL") && payload.recipientId) {
        const user = member || (await user_model_1.User.findById(payload.recipientId)) || (await user_model_1.User.findOne({ id: String(payload.recipientId) }));
        if (user && user.email) {
            const isHtml = payload.message?.includes("<div") || payload.message?.includes("<p>");
            const html = isHtml
                ? payload.message
                : `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #00B074;">${payload.title}</h2>
          <p>${payload.message}</p>
        </div>
      `;
            console.log(`📧 Sending notification email to: ${user.email} [${payload.title}]`);
            await (0, sendEmail_1.sendEmail)(user.email, payload.title || "Notification", html, payload.message)
                .then(() => console.log(`✅ Notification email delivered to ${user.email}`))
                .catch((err) => console.error(`❌ Email send error to ${user.email}:`, err));
        }
    }
    return result;
};
const ADMIN_VISIBLE_TYPES = [
    "WITHDRAWAL_REQUEST",
    "DEPOSIT_SUCCESS",
    "DUE_ALERT",
    "DIRECT_ADMIN_MSG",
    "SUPERADMIN_SECURITY_ALERT",
    "GENERAL",
];
const getUserNotifications = async (userId, role, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    // Resolve member _id if userId is memberCode
    let targetId = userId;
    if (typeof userId === "string" && !userId.match(/^[0-9a-fA-F]{24}$/)) {
        const member = await member_model_1.Member.findOne({ memberCode: userId });
        if (member)
            targetId = member._id.toString();
    }
    // Build filter query
    let filterQuery = {
        $or: [{ recipientId: targetId }, { recipientId: userId }],
    };
    if (role === "admin" || role === "superAdmin" || role === "manager") {
        filterQuery = {
            $or: [
                { recipientId: targetId },
                { recipientId: userId },
                { type: { $in: ADMIN_VISIBLE_TYPES } },
            ],
        };
    }
    const [data, total, unreadCount] = await Promise.all([
        notification_model_1.Notification.find(filterQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        notification_model_1.Notification.countDocuments(filterQuery),
        notification_model_1.Notification.countDocuments({ ...filterQuery, isRead: false }),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit) || 1,
            unreadCount,
        },
        unreadCount,
        data,
    };
};
const getPendingPopups = async (userId) => {
    let targetId = userId;
    if (typeof userId === "string" && !userId.match(/^[0-9a-fA-F]{24}$/)) {
        const member = await member_model_1.Member.findOne({ memberCode: userId });
        if (member)
            targetId = member._id.toString();
    }
    const data = await notification_model_1.Notification.find({
        $or: [{ recipientId: targetId }, { recipientId: userId }],
        requiresAction: true,
        isAcknowledged: false,
    }).sort({ createdAt: -1 });
    return data;
};
const markNotificationAsRead = async (id, userId, role) => {
    const filter = { _id: id };
    if (role !== "admin" && role !== "superAdmin" && role !== "manager") {
        filter.recipientId = userId;
    }
    const result = await notification_model_1.Notification.findOneAndUpdate(filter, { isRead: true }, { new: true });
    // Compute updated unread count
    let unreadFilter = { recipientId: userId, isRead: false };
    if (role === "admin" || role === "superAdmin" || role === "manager") {
        unreadFilter = {
            $or: [
                { recipientId: userId },
                { type: { $in: ADMIN_VISIBLE_TYPES } },
            ],
            isRead: false,
        };
    }
    const unreadCount = await notification_model_1.Notification.countDocuments(unreadFilter);
    // Emit to socket in real-time
    const io = (0, socket_1.getIO)();
    if (io) {
        if (userId) {
            const userRoom = userId.toString();
            io.to(userRoom).emit("notification_read", { notificationId: id, unreadCount });
            io.to(userRoom).emit("unread_count_updated", { unreadCount });
        }
        if (role === "admin" || role === "superAdmin" || role === "manager") {
            io.to("admin-room").emit("notification_read", { notificationId: id, unreadCount });
            io.to("admin-room").emit("unread_count_updated", { unreadCount });
        }
    }
    return { notification: result, unreadCount };
};
const markAllNotificationsAsRead = async (userId, role) => {
    let filter = { recipientId: userId, isRead: false };
    if (role === "admin" || role === "superAdmin" || role === "manager") {
        filter = {
            $or: [
                { recipientId: userId },
                { type: { $in: ADMIN_VISIBLE_TYPES } },
            ],
            isRead: false,
        };
    }
    const result = await notification_model_1.Notification.updateMany(filter, { isRead: true });
    // Real-time broadcast
    const io = (0, socket_1.getIO)();
    if (io) {
        if (userId) {
            const userRoom = userId.toString();
            io.to(userRoom).emit("unread_count_updated", { unreadCount: 0 });
        }
        if (role === "admin" || role === "superAdmin" || role === "manager") {
            io.to("admin-room").emit("unread_count_updated", { unreadCount: 0 });
        }
    }
    return { modifiedCount: result.modifiedCount, unreadCount: 0 };
};
const acknowledgeNotification = async (id, userId) => {
    const result = await notification_model_1.Notification.findOneAndUpdate({ _id: id, recipientId: userId }, { isAcknowledged: true, isRead: true }, { new: true });
    const unreadCount = await notification_model_1.Notification.countDocuments({
        recipientId: userId,
        isRead: false,
    });
    const io = (0, socket_1.getIO)();
    if (io && userId) {
        io.to(userId.toString()).emit("unread_count_updated", { unreadCount });
    }
    return result;
};
exports.NotificationServices = {
    createNotification,
    getUserNotifications,
    getPendingPopups,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    acknowledgeNotification,
};
//# sourceMappingURL=notification.service.js.map