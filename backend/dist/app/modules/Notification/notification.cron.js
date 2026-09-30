"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMonthlyDueReminderCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const member_model_1 = require("../Member/member.model");
const notification_service_1 = require("./notification.service");
const initMonthlyDueReminderCron = () => {
    // Monthly Due Reminder Cron (runs on 15th of every month at 9 AM)
    node_cron_1.default.schedule("0 9 15 * *", async () => {
        try {
            console.log("Running monthly due reminder cron job...");
            const dueMembers = await member_model_1.Member.find({ dueAmount: { $gt: 0 }, isDeleted: false });
            for (const member of dueMembers) {
                const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
            <h2 style="color: #F59E0B;">Monthly Due Reminder</h2>
            <p>Dear <strong>${member.fullName}</strong>,</p>
            <p>Your monthly due of <strong>৳${member.dueAmount}</strong> is pending for the current billing cycle.</p>
            <p>Please complete your payment as soon as possible to avoid any late fees or disruptions.</p>
            <br/>
            <p style="color: #6B7280; font-size: 13px;">Thank you,<br/>Friends Goal Society</p>
          </div>
        `;
                await notification_service_1.NotificationServices.createNotification({
                    recipientId: member._id,
                    title: "Monthly Due Reminder",
                    message: htmlBody,
                    type: "DUE_ALERT",
                    channel: ["IN_APP", "EMAIL", "SMS"],
                    requiresAction: true, // E: Due Allocation & Mandatory Login Pop-up
                    isRead: false,
                    isAcknowledged: false,
                    metadata: { dueAmount: member.dueAmount },
                });
            }
            console.log(`Monthly due reminder completed. Sent to ${dueMembers.length} members.`);
        }
        catch (error) {
            console.error("Error running monthly due reminder cron:", error);
        }
    });
};
exports.initMonthlyDueReminderCron = initMonthlyDueReminderCron;
//# sourceMappingURL=notification.cron.js.map