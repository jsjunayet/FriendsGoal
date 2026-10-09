import { Request, Response } from "express";
export declare const NotificationControllers: {
    getUserNotifications: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPendingPopups: (req: Request, res: Response, next: import("express").NextFunction) => void;
    acknowledgeNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markNotificationAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markAllNotificationsAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    sendDirectNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=notification.controller.d.ts.map