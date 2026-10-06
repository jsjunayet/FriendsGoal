import type { Model } from "mongoose";

export interface IBilingualText {
  bn: string;
  en: string;
}

export interface IStatCounter {
  _id?: string;
  key: string;
  label: IBilingualText;
  value: string;
  order?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StatCounterModel = Model<IStatCounter>;
