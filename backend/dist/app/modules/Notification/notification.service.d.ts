import { INotification } from "./notification.interface";
import { Types } from "mongoose";
declare const createNotification: (payload: Partial<INotification>) => Promise<import("mongoose").Document<unknown, {}, INotification, {}, import("mongoose").DefaultSchemaOptions> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getUserNotifications: (userId: string, role: string, query: any) => Promise<{
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: (import("mongoose").Document<unknown, {}, INotification, {}, import("mongoose").DefaultSchemaOptions> & INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
}>;
declare const getPendingPopups: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, INotification, {}, import("mongoose").DefaultSchemaOptions> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const acknowledgeNotification: (id: string, userId: string) => Promise<(import("mongoose").Document<unknown, {}, INotification, {}, import("mongoose").DefaultSchemaOptions> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const NotificationServices: {
    createNotification: typeof createNotification;
    getUserNotifications: typeof getUserNotifications;
    getPendingPopups: typeof getPendingPopups;
    acknowledgeNotification: typeof acknowledgeNotification;
};
export {};
//# sourceMappingURL=notification.service.d.ts.map