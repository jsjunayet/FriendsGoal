import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config/index";
import { OperationServices } from "./app/modules/Operation/operation.service";
import { initMonthlyDueReminderCron } from "./app/modules/Notification/notification.cron";
import seedSuperAdmin from "./app/DB/index";
import { initSocket } from "./shared/socket";
// Trigger reload for TEST_MODE config
let server: Server;

async function main() {
  try {
    const mongoUri = config.database_url;
    if (!mongoUri) {
      throw new Error("Missing DATABASE_URL in environment configuration.");
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 10,
    });

    // Initialize recurring monthly auto-billing cron engine
    OperationServices.initMonthlyAutoBillingCron();
    initMonthlyDueReminderCron();

    await seedSuperAdmin();
    const port = config.port || 5000;
    server = app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
    
    // Init socket
    initSocket(server);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
