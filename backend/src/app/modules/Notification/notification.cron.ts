import cron from "node-cron";
import { Member } from "../Member/member.model";
import { NotificationServices } from "./notification.service";
import { getCronConfig } from "../../config/cron.config";

export const initMonthlyDueReminderCron = () => {
  const cronConfig = getCronConfig();
  console.log(`🔔 Initializing Due Reminder Cron: ${cronConfig.dueReminder.description} [Schedule: ${cronConfig.dueReminder.schedule}]`);

  cron.schedule(cronConfig.dueReminder.schedule, async () => {
    try {
      console.log(`🔔 Running Due Reminder Cron Job (${cronConfig.dueReminder.description})...`);
      
      const dueMembers = await Member.find({ dueAmount: { $gt: 0 }, isDeleted: false });
      console.log(`🔔 Found ${dueMembers.length} members with outstanding dues. Sending 3-minute reminders...`);
      
      for (const member of dueMembers) {
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
            <h2 style="color: #DC2626;">Monthly Due Reminder</h2>
            <p>Dear <strong>${member.fullName}</strong>,</p>
            <p>Your pending overdue balance of <strong style="color: #DC2626; font-size: 16px;">৳${member.dueAmount}</strong> is pending for payment.</p>
            <p>Please complete your payment as soon as possible to keep your account active and avoid any disruptions.</p>
            <br/>
            <p style="color: #6B7280; font-size: 13px;">Thank you,<br/>Friends Goal Society</p>
          </div>
        `;

        await NotificationServices.createNotification({
          recipientId: member._id,
          title: "Monthly Due Reminder",
          message: htmlBody,
          type: "DUE_ALERT",
          channel: ["IN_APP", "EMAIL", "SMS"],
          requiresAction: true, // Triggers real-time popup blocker
          isRead: false,
          isAcknowledged: false,
          metadata: { dueAmount: member.dueAmount },
        });
      }
      
      console.log(`✅ Monthly due reminders completed. Sent to ${dueMembers.length} members.`);
    } catch (error) {
      console.error("Error running monthly due reminder cron:", error);
    }
  });
};
