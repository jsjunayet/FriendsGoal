import { Model } from "mongoose";

export interface IBilingualText {
  bn: string;
  en: string;
}

export interface IMarqueeItem {
  _id?: string;
  headline: IBilingualText;
  text?: IBilingualText;
  targetLink: string;
  link?: string;
  isActive: boolean;
  priority?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type MarqueeModel = Model<IMarqueeItem>;
