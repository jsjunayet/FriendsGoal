import { Notification } from "./notification.model";
import { INotification } from "./notification.interface";
import { getIO } from "../../../shared/socket";
import { sendEmail } from "../../../shared/sendEmail";
import { Types } from "mongoose";
import { User } from "../User/user.model";
import { Member } from "../Member/member.model";

const createNotification = async (payload: Partial<INotification>) => {
  const result = await Notification.create(payload);
  
  if (payload.channel?.includes("IN_APP")) {
    const io = getIO();
    if (io) {
      if (payload.recipientId) {
        const recipientRoom = payload.recipientId.toString();
        // Emit both naming variants for bulletproof frontend compatibility
        io.to(recipientRoom).emit("new-notification", result);
        io.to(recipientRoom).emit("new_notification", result);

        // Emit updated unread count to recipient
        const unreadCount = await Notification.countDocuments({
          recipientId: payload.recipientId,
          isRead: false,
        });
        io.to(recipientRoom).emit("unread_count_updated", { unreadCount });
      }

      // Broadcast to admin-room for admins to see live system activity
      io.to("admin-room").emit("new-notification", result);
      io.to("admin-room").emit("new_notification", result);

      const adminUnreadCount = await Notification.countDocuments({
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
    const user = (await Member.findById(payload.recipientId)) || (await User.findById(payload.recipientId));
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
      await sendEmail(user.email, payload.title || "Notification", html as string, payload.message).catch((err) =>
        console.error("Email send error:", err)
      );
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

const getUserNotifications = async (userId: string, role: string, query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter query
  let filterQuery: any = { recipientId: userId };
  
  if (role === "admin" || role === "superAdmin" || role === "manager") {
    filterQuery = {
      $or: [
        { recipientId: userId },
        { type: { $in: ADMIN_VISIBLE_TYPES } },
      ],
    };
  }

  const [data, total, unreadCount] = await Promise.all([
    Notification.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filterQuery),
    Notification.countDocuments({ ...filterQuery, isRead: false }),
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

const getPendingPopups = async (userId: string) => {
  const data = await Notification.find({
    recipientId: userId,
    requiresAction: true,
    isAcknowledged: false,
  }).sort({ createdAt: -1 });
  return data;
};

const markNotificationAsRead = async (id: string, userId: string, role?: string) => {
  const filter: any = { _id: id };
  if (role !== "admin" && role !== "superAdmin" && role !== "manager") {
    filter.recipientId = userId;
  }

  const result = await Notification.findOneAndUpdate(
    filter,
    { isRead: true },
    { new: true }
  );

  // Compute updated unread count
  let unreadFilter: any = { recipientId: userId, isRead: false };
  if (role === "admin" || role === "superAdmin" || role === "manager") {
    unreadFilter = {
      $or: [
        { recipientId: userId },
        { type: { $in: ADMIN_VISIBLE_TYPES } },
      ],
      isRead: false,
    };
  }
  const unreadCount = await Notification.countDocuments(unreadFilter);

  // Emit to socket in real-time
  const io = getIO();
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

const markAllNotificationsAsRead = async (userId: string, role?: string) => {
  let filter: any = { recipientId: userId, isRead: false };
  if (role === "admin" || role === "superAdmin" || role === "manager") {
    filter = {
      $or: [
        { recipientId: userId },
        { type: { $in: ADMIN_VISIBLE_TYPES } },
      ],
      isRead: false,
    };
  }

  const result = await Notification.updateMany(filter, { isRead: true });

  // Real-time broadcast
  const io = getIO();
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

const acknowledgeNotification = async (id: string, userId: string) => {
  const result = await Notification.findOneAndUpdate(
    { _id: id, recipientId: userId },
    { isAcknowledged: true, isRead: true },
    { new: true }
  );

  const unreadCount = await Notification.countDocuments({
    recipientId: userId,
    isRead: false,
  });

  const io = getIO();
  if (io && userId) {
    io.to(userId.toString()).emit("unread_count_updated", { unreadCount });
  }

  return result;
};

export const NotificationServices = {
  createNotification,
  getUserNotifications,
  getPendingPopups,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  acknowledgeNotification,
};
