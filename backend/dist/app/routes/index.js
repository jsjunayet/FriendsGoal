"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const member_route_1 = require("../modules/Member/member.route");
const operation_route_1 = require("../modules/Operation/operation.route");
const adjustment_route_1 = require("../modules/Adjustment/adjustment.route");
const expense_route_1 = require("../modules/Expense/expense.route");
const investment_route_1 = require("../modules/Investment/investment.route");
const disbursement_route_1 = require("../modules/Disbursement/disbursement.route");
const withdrawal_route_1 = require("../modules/Withdrawal/withdrawal.route");
const auditLog_route_1 = require("../modules/AuditLog/auditLog.route");
const report_route_1 = require("../modules/Report/report.route");
const analytics_route_1 = require("../modules/Analytics/analytics.route");
const notification_route_1 = require("../modules/Notification/notification.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/members",
        route: member_route_1.MemberRoutes,
    },
    {
        path: "/reports",
        route: report_route_1.ReportRoutes,
    },
    {
        path: "/operations",
        route: operation_route_1.OperationRoutes,
    },
    {
        path: "/adjustments",
        route: adjustment_route_1.AdjustmentRoutes,
    },
    {
        path: "/expenses",
        route: expense_route_1.ExpenseRoutes,
    },
    {
        path: "/expense-categories",
        route: expense_route_1.ExpenseCategoryRoutes,
    },
    {
        path: "/investments",
        route: investment_route_1.InvestmentRoutes,
    },
    {
        path: "/disbursements",
        route: disbursement_route_1.DisbursementRoutes,
    },
    {
        path: "/withdrawals",
        route: withdrawal_route_1.WithdrawalRoutes,
    },
    {
        path: "/admin/withdrawals",
        route: withdrawal_route_1.WithdrawalRoutes,
    },
    {
        path: "/audit-logs",
        route: auditLog_route_1.AuditLogRoutes,
    },
    {
        path: "/admin/audit-logs",
        route: auditLog_route_1.AuditLogRoutes,
    },
    {
        path: "/analytics",
        route: analytics_route_1.AnalyticsRoutes,
    },
    {
        path: "/notifications",
        route: notification_route_1.NotificationRoutes,
    },
    {
        path: "/admin/notifications",
        route: notification_route_1.AdminNotificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map