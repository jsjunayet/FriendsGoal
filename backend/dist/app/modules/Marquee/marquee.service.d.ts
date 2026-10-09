import { IMarqueeItem } from "./marquee.interface";
declare const getActiveMarqueeItemsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IMarqueeItem, {}, import("mongoose").DefaultSchemaOptions> & IMarqueeItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getAllMarqueeItemsFromDB: (onlyActive?: boolean) => Promise<(import("mongoose").Document<unknown, {}, IMarqueeItem, {}, import("mongoose").DefaultSchemaOptions> & IMarqueeItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const createMarqueeItemIntoDB: (payload: any) => Promise<import("mongoose").Document<unknown, {}, IMarqueeItem, {}, import("mongoose").DefaultSchemaOptions> & IMarqueeItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateMarqueeItemInDB: (id: string, payload: any) => Promise<(import("mongoose").Document<unknown, {}, IMarqueeItem, {}, import("mongoose").DefaultSchemaOptions> & IMarqueeItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const deleteMarqueeItemFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IMarqueeItem, {}, import("mongoose").DefaultSchemaOptions> & IMarqueeItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const MarqueeServices: {
    getActiveMarqueeItemsFromDB: typeof getActiveMarqueeItemsFromDB;
    getAllMarqueeItemsFromDB: typeof getAllMarqueeItemsFromDB;
    createMarqueeItemIntoDB: typeof createMarqueeItemIntoDB;
    updateMarqueeItemInDB: typeof updateMarqueeItemInDB;
    deleteMarqueeItemFromDB: typeof deleteMarqueeItemFromDB;
};
export {};
//# sourceMappingURL=marquee.service.d.ts.map