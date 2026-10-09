import type { Model } from "mongoose";
export interface IBilingualText {
    bn: string;
    en: string;
}
export interface IAgendaItem {
    num?: number;
    title: IBilingualText;
    text: IBilingualText;
}
export interface INotice {
    _id?: string;
    category?: IBilingualText;
    title: IBilingualText;
    description: IBilingualText;
    content: IBilingualText;
    images?: string[];
    publishedDate?: string;
    isTickerActive?: boolean;
    author?: string;
    slug?: string;
    agendaHighlights?: IAgendaItem[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type NoticeModel = Model<INotice>;
//# sourceMappingURL=notice.interface.d.ts.map