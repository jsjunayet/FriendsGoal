import type { IGalleryItem } from "./gallery.interface";
declare const createGalleryItemIntoDB: (payload: IGalleryItem) => Promise<import("mongoose").Document<unknown, {}, IGalleryItem, {}, import("mongoose").DefaultSchemaOptions> & IGalleryItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getAllGalleryItemsFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, IGalleryItem, {}, import("mongoose").DefaultSchemaOptions> & IGalleryItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getSingleGalleryItemFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGalleryItem, {}, import("mongoose").DefaultSchemaOptions> & IGalleryItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateGalleryItemInDB: (id: string, payload: Partial<IGalleryItem>) => Promise<(import("mongoose").Document<unknown, {}, IGalleryItem, {}, import("mongoose").DefaultSchemaOptions> & IGalleryItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const deleteGalleryItemFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IGalleryItem, {}, import("mongoose").DefaultSchemaOptions> & IGalleryItem & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const GalleryService: {
    createGalleryItemIntoDB: typeof createGalleryItemIntoDB;
    getAllGalleryItemsFromDB: typeof getAllGalleryItemsFromDB;
    getSingleGalleryItemFromDB: typeof getSingleGalleryItemFromDB;
    updateGalleryItemInDB: typeof updateGalleryItemInDB;
    deleteGalleryItemFromDB: typeof deleteGalleryItemFromDB;
};
export {};
//# sourceMappingURL=gallery.service.d.ts.map