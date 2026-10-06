import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { MemberRoutes } from "../modules/Member/member.route";

import { OperationRoutes } from "../modules/Operation/operation.route";
import { AdjustmentRoutes } from "../modules/Adjustment/adjustment.route";
import {
  ExpenseRoutes,
  ExpenseCategoryRoutes,
} from "../modules/Expense/expense.route";
import { InvestmentRoutes } from "../modules/Investment/investment.route";
import { DisbursementRoutes } from "../modules/Disbursement/disbursement.route";
import { WithdrawalRoutes } from "../modules/Withdrawal/withdrawal.route";
import { AuditLogRoutes } from "../modules/AuditLog/auditLog.route";
import { ReportRoutes } from "../modules/Report/report.route";
import { AnalyticsRoutes } from "../modules/Analytics/analytics.route";
import { NotificationRoutes, AdminNotificationRoutes } from "../modules/Notification/notification.route";
import { NoticeRoutes } from "../modules/Notice/notice.route";
import { MarqueeRoutes } from "../modules/Marquee/marquee.route";
import { GalleryRoutes } from "../modules/Gallery/gallery.route";
import { StatRoutes } from "../modules/Stats/stats.route";
import { UploadRoutes } from "../modules/Upload/upload.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/members",
    route: MemberRoutes,
  },
  {
    path: "/notices",
    route: NoticeRoutes,
  },
  {
    path: "/marquee",
    route: MarqueeRoutes,
  },
  {
    path: "/gallery",
    route: GalleryRoutes,
  },
  {
    path: "/stats",
    route: StatRoutes,
  },
  {
    path: "/upload",
    route: UploadRoutes,
  },
  {
    path: "/reports",
    route: ReportRoutes,
  },
  {
    path: "/operations",
    route: OperationRoutes,
  },
  {
    path: "/adjustments",
    route: AdjustmentRoutes,
  },
  {
    path: "/expenses",
    route: ExpenseRoutes,
  },
  {
    path: "/expense-categories",
    route: ExpenseCategoryRoutes,
  },
  {
    path: "/investments",
    route: InvestmentRoutes,
  },
  {
    path: "/disbursements",
    route: DisbursementRoutes,
  },
  {
    path: "/withdrawals",
    route: WithdrawalRoutes,
  },
  {
    path: "/admin/withdrawals",
    route: WithdrawalRoutes,
  },
  {
    path: "/audit-logs",
    route: AuditLogRoutes,
  },
  {
    path: "/admin/audit-logs",
    route: AuditLogRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/admin/notifications",
    route: AdminNotificationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
