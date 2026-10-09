import type { IStatCounter } from "./stats.interface";
declare const getAllStatsFromDB: () => Promise<{
    key: string;
    label: {
        bn: string;
        en: string;
    };
    value: string;
    order: number;
}[] | (import("mongoose").Document<unknown, {}, IStatCounter, {}, import("mongoose").DefaultSchemaOptions> & IStatCounter & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const updateStatInDB: (id: string, payload: Partial<IStatCounter>) => Promise<(import("mongoose").Document<unknown, {}, IStatCounter, {}, import("mongoose").DefaultSchemaOptions> & IStatCounter & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const bulkUpsertStatsInDB: (payload: any) => Promise<{
    key: string;
    label: {
        bn: string;
        en: string;
    };
    value: string;
    order: number;
}[] | (import("mongoose").Document<unknown, {}, IStatCounter, {}, import("mongoose").DefaultSchemaOptions> & IStatCounter & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
declare const createStatInDB: (payload: IStatCounter) => Promise<import("mongoose").Document<unknown, {}, IStatCounter, {}, import("mongoose").DefaultSchemaOptions> & IStatCounter & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const StatService: {
    getAllStatsFromDB: typeof getAllStatsFromDB;
    updateStatInDB: typeof updateStatInDB;
    bulkUpsertStatsInDB: typeof bulkUpsertStatsInDB;
    createStatInDB: typeof createStatInDB;
};
export {};
//# sourceMappingURL=stats.service.d.ts.map