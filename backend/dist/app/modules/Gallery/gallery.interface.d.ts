import type { Model } from "mongoose";
import type { IBilingualText } from "../Notice/notice.interface";
export interface IGalleryItem {
    _id?: string;
    title: IBilingualText;
    subtitle?: IBilingualText;
    images: string[];
    category: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type GalleryModel = Model<IGalleryItem>;
//# sourceMappingURL=gallery.interface.d.ts.map