import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { NotificationServices } from "./notification.service";

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user?._id || user?.userId;
  const role = user?.role;
  const result = await NotificationServices.getUserNotifications(userId, role, req.query);

  res.status(200).json({
    success: true,
    message: "Notifications retrieved successfully",
    ...result,
  });
});

const getPendingPopups = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user?._id || user?.userId;
  const result = await NotificationServices.getPendingPopups(userId);

  res.status(200).json({
    success: true,
    message: "Pending popups retrieved successfully",
    data: result,
  });
});

const acknowledgeNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const userId = user?._id || user?.userId;
  const result = await NotificationServices.acknowledgeNotification(id as string, userId);

  res.status(200).json({
    success: true,
    message: "Notification acknowledged successfully",
    data: result,
  });
});

const sendDirectNotification = catchAsync(async (req: Request, res: Response) => {
  // Admin targeted notification
  const { recipientIds, title, message, channel, requiresAction } = req.body;
  
  const results = [];
  for (const recipientId of recipientIds) {
    const result = await NotificationServices.createNotification({
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

export const NotificationControllers = {
  getUserNotifications,
  getPendingPopups,
  acknowledgeNotification,
  sendDirectNotification,
};
