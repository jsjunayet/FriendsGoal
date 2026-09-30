"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./app/config/index"));
const operation_service_1 = require("./app/modules/Operation/operation.service");
const notification_cron_1 = require("./app/modules/Notification/notification.cron");
const index_2 = __importDefault(require("./app/DB/index"));
const socket_1 = require("./shared/socket");
let server;
async function main() {
    try {
        const mongoUri = index_1.default.database_url;
        if (!mongoUri) {
            throw new Error("Missing DATABASE_URL in environment configuration.");
        }
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 50,
            minPoolSize: 10,
        });
        // Initialize recurring monthly auto-billing cron engine
        operation_service_1.OperationServices.initMonthlyAutoBillingCron();
        (0, notification_cron_1.initMonthlyDueReminderCron)();
        await (0, index_2.default)();
        server = app_1.default.listen(5000, () => {
            console.log(`app is listening on port ${5000}`);
        });
        // Init socket
        (0, socket_1.initSocket)(server);
    }
    catch (err) {
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
//# sourceMappingURL=server.js.map