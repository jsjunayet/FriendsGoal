import type { INotice } from "./notice.interface";
declare const createNoticeIntoDB: (payload: INotice) => Promise<import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getAllNoticesFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getTickerNoticesFromDB: () => Promise<(import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getSingleNoticeFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateNoticeInDB: (id: string, payload: Partial<INotice>) => Promise<(import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const deleteNoticeFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, INotice, {}, import("mongoose").DefaultSchemaOptions> & INotice & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const NoticeService: {
    createNoticeIntoDB: typeof createNoticeIntoDB;
    getAllNoticesFromDB: typeof getAllNoticesFromDB;
    getTickerNoticesFromDB: typeof getTickerNoticesFromDB;
    getSingleNoticeFromDB: typeof getSingleNoticeFromDB;
    updateNoticeInDB: typeof updateNoticeInDB;
    deleteNoticeFromDB: typeof deleteNoticeFromDB;
};
export {};
//# sourceMappingURL=notice.service.d.ts.map