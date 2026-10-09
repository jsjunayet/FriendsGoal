"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCronConfig = void 0;
const index_1 = __importDefault(require("./index"));
/**
 * Switchable cron configuration:
 * Set TEST_MODE=true in .env to activate high-frequency test intervals:
 * - Due Generation: Every 1 minute (deducts/adds 1 BDT)
 * - Due Reminder Alert: Every 3 minutes (emits real-time popups & emails)
 *
 * Default Production Mode (TEST_MODE=false):
 * - Due Generation: 1st day of every month at 00:00 (1000 BDT)
 * - Due Reminder Alert: 15th day of every month at 09:00 AM
 */
const getCronConfig = () => {
    const isTestMode = index_1.default.test_mode === true || process.env.TEST_MODE === "true";
    if (isTestMode) {
        return {
            isTestMode: true,
            dueGeneration: {
                schedule: "* * * * *", // Every 1 minute
                amount: Number(process.env.TEST_CHARGE_AMOUNT) || 1000, // 1000 BDT (1k) for testing
                description: "⚡ TEST MODE: 1-minute interval, ৳1,000 due allocation",
            },
            dueReminder: {
                schedule: "*/3 * * * *", // Every 3 minutes
                description: "⚡ TEST MODE: 3-minute interval, real-time popup & email reminder",
            },
        };
    }
    return {
        isTestMode: false,
        dueGeneration: {
            schedule: "0 0 1 * *", // 1st day of every month at 00:00
            amount: 1000, // 1000 BDT standard monthly fee
            description: "🚀 PRODUCTION: 1st of every month at midnight, ৳1,000 due allocation",
        },
        dueReminder: {
            schedule: "0 9 15 * *", // 15th day of every month at 9:00 AM
            description: "🚀 PRODUCTION: 15th of every month at 9:00 AM, due reminder alert",
        },
    };
};
exports.getCronConfig = getCronConfig;
//# sourceMappingURL=cron.config.js.map