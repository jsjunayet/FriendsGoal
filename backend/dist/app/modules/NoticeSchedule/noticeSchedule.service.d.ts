import type { INoticeSchedule } from "./noticeSchedule.interface";
declare const createNoticeScheduleInDB: (payload: INoticeSchedule) => Promise<import("mongoose").Document<unknown, {}, INoticeSchedule, {}, import("mongoose").DefaultSchemaOptions> & INoticeSchedule & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getAllNoticeSchedulesFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, INoticeSchedule, {}, import("mongoose").DefaultSchemaOptions> & INoticeSchedule & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getSingleNoticeScheduleFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, INoticeSchedule, {}, import("mongoose").DefaultSchemaOptions> & INoticeSchedule & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateNoticeScheduleInDB: (id: string, payload: Partial<INoticeSchedule>) => Promise<import("mongoose").Document<unknown, {}, INoticeSchedule, {}, import("mongoose").DefaultSchemaOptions> & INoticeSchedule & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const deleteNoticeScheduleFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, INoticeSchedule, {}, import("mongoose").DefaultSchemaOptions> & INoticeSchedule & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const NoticeScheduleServices: {
    createNoticeScheduleInDB: typeof createNoticeScheduleInDB;
    getAllNoticeSchedulesFromDB: typeof getAllNoticeSchedulesFromDB;
    getSingleNoticeScheduleFromDB: typeof getSingleNoticeScheduleFromDB;
    updateNoticeScheduleInDB: typeof updateNoticeScheduleInDB;
    deleteNoticeScheduleFromDB: typeof deleteNoticeScheduleFromDB;
};
export {};
//# sourceMappingURL=noticeSchedule.service.d.ts.map