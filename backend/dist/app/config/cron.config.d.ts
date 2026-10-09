export interface ICronJobDetail {
    schedule: string;
    amount?: number;
    description: string;
}
export interface ICronConfiguration {
    isTestMode: boolean;
    dueGeneration: ICronJobDetail;
    dueReminder: ICronJobDetail;
}
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
export declare const getCronConfig: () => ICronConfiguration;
//# sourceMappingURL=cron.config.d.ts.map