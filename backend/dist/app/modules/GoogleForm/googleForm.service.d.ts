import type { IGoogleForm } from "./googleForm.interface";
/**
 * Extracts iframe src or returns clean URL
 */
export declare const extractEmbedUrl: (input: string) => string;
declare const createGoogleFormInDB: (payload: IGoogleForm) => Promise<import("mongoose").Document<unknown, {}, IGoogleForm, {}, import("mongoose").DefaultSchemaOptions> & IGoogleForm & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getAllGoogleFormsFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, IGoogleForm, {}, import("mongoose").DefaultSchemaOptions> & IGoogleForm & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const getSingleGoogleFormFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGoogleForm, {}, import("mongoose").DefaultSchemaOptions> & IGoogleForm & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const updateGoogleFormInDB: (id: string, payload: Partial<IGoogleForm>) => Promise<import("mongoose").Document<unknown, {}, IGoogleForm, {}, import("mongoose").DefaultSchemaOptions> & IGoogleForm & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const deleteGoogleFormFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGoogleForm, {}, import("mongoose").DefaultSchemaOptions> & IGoogleForm & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const GoogleFormServices: {
    createGoogleFormInDB: typeof createGoogleFormInDB;
    getAllGoogleFormsFromDB: typeof getAllGoogleFormsFromDB;
    getSingleGoogleFormFromDB: typeof getSingleGoogleFormFromDB;
    updateGoogleFormInDB: typeof updateGoogleFormInDB;
    deleteGoogleFormFromDB: typeof deleteGoogleFormFromDB;
};
export {};
//# sourceMappingURL=googleForm.service.d.ts.map