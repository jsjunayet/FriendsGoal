declare const getOverviewFromDB: () => Promise<{
    totalAmounts: number;
    profits: number;
    membersReceived: number;
    othersReceived: number;
    dueAmounts: number;
    expenseAmounts: number;
}>;
declare const getMonthlyCollectionsFromDB: () => Promise<{
    month: string | undefined;
    amount: any;
    isCurrent: boolean;
}[]>;
export declare const AnalyticsServices: {
    getOverviewFromDB: typeof getOverviewFromDB;
    getMonthlyCollectionsFromDB: typeof getMonthlyCollectionsFromDB;
};
export {};
//# sourceMappingURL=analytics.service.d.ts.map