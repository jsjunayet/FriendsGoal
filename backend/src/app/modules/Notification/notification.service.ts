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
    const user = await Member.findById(payload.recipientId) || await User.findById(payload.recipientId);
    if (user && user.email) {
      // Check if message is already HTML formatted (very basic check)
      const isHtml = payload.message?.includes("<div") || payload.message?.includes("<p>");
      const html = isHtml ? payload.message : `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #00B074;">${payload.title}</h2>
          <p>${payload.message}</p>
        </div>
      `;
      await sendEmail(user.email, payload.title || "Notification", html as string, payload.message);
    }
  }

  // SMS handler can be added here
  
  return result;
};

const getUserNotifications = async (userId: string, role: string, query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter query
  const filterQuery: any = { $or: [{ recipientId: userId }] };
  
  if (role === "admin" || role === "superAdmin") {
    filterQuery.$or.push({ type: "WITHDRAWAL_REQUEST" });
    filterQuery.$or.push({ type: "DEPOSIT_SUCCESS" });
  }

  const data = await Notification.find(filterQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filterQuery);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) || 1 },
    data,
  };
};

const getPendingPopups = async (userId: string) => {
  const data = await Notification.find({
    recipientId: userId,
    requiresAction: true,
    isAcknowledged: false,
  });
  return data;
};

const acknowledgeNotification = async (id: string, userId: string) => {
  const result = await Notification.findOneAndUpdate(
    { _id: id, recipientId: userId },
    { isAcknowledged: true, isRead: true },
    { new: true }
  );
  return result;
};

export const NotificationServices = {
  createNotification,
  getUserNotifications,
  getPendingPopups,
  acknowledgeNotification,
};
