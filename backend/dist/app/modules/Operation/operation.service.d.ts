import type { IDueListItem, IExportFilterOptions } from "./operation.interface";
interface DueListQueryParams {
    searchByCodeOrName?: string;
    year?: string;
    status?: "All" | "Advance" | "Due" | "Zero";
    dateRange?: string;
    page?: number | string;
    limit?: number | string;
}
declare const getDueListFromDB: (query: DueListQueryParams) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        allCount: number;
        advanceCount: number;
        dueCount: number;
        zeroCount: number;
    };
    data: IDueListItem[];
}>;
declare const getFilteredDueListDataset: (query: IExportFilterOptions) => Promise<IDueListItem[]>;
declare const getCollectionsFromDB: (memberId?: string) => Promise<{
    memberInfo: null;
    dueBalance: number;
    advanceBalance: number;
    data: (import("mongoose").Document<unknown, {}, import("./operation.interface").ICollection, {}, import("mongoose").DefaultSchemaOptions> & import("./operation.interface").ICollection & Required<{
        _id: string;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
} | {
    memberInfo: {
        id: string;
        memberCode: string;
        memberName: string;
        mobileNo: string;
        dueAmount: number;
        savingsBalance: number;
        totalDeposit: number;
    };
    dueBalance: number;
    advanceBalance: number;
    data: (import("mongoose").Document<unknown, {}, import("./operation.interface").ICollection, {}, import("mongoose").DefaultSchemaOptions> & import("./operation.interface").ICollection & Required<{
        _id: string;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
}>;
interface CollectPaymentPayload {
    memberId: string;
    amount: number;
    paymentMethod?: "cash" | "bank" | "mobile_banking";
    month?: string;
    note?: string;
}
declare const collectPaymentIntoDB: (payload: CollectPaymentPayload) => Promise<{
    receiptNo: string;
    amountPaid: number;
    member: string;
    date: string;
    entryNo: number;
    status: string;
    dueBalance: number;
    advanceBalance: number;
    collection: import("mongoose").Document<unknown, {}, import("./operation.interface").ICollection, {}, import("mongoose").DefaultSchemaOptions> & import("./operation.interface").ICollection & Required<{
        _id: string;
    }> & {
        __v: number;
    } & {
        id: string;
    };
}>;
declare const initMonthlyAutoBillingCron: () => void;
export declare const OperationServices: {
    getDueListFromDB: typeof getDueListFromDB;
    getFilteredDueListDataset: typeof getFilteredDueListDataset;
    getCollectionsFromDB: typeof getCollectionsFromDB;
    collectPaymentIntoDB: typeof collectPaymentIntoDB;
    initMonthlyAutoBillingCron: typeof initMonthlyAutoBillingCron;
};
export {};
//# sourceMappingURL=operation.service.d.ts.map