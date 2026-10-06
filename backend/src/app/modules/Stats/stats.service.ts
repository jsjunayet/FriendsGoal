import { StatCounter } from "./stats.model";
import type { IStatCounter } from "./stats.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getAllStatsFromDB = async () => {
  const stats = await StatCounter.find({ isDeleted: false }).sort({ order: 1, createdAt: 1 });
  return stats;
};

const updateStatInDB = async (id: string, payload: Partial<IStatCounter>) => {
  const stat = await StatCounter.findOne({ _id: id, isDeleted: false });
  if (!stat) {
    throw new AppError(httpStatus.NOT_FOUND, "Stat counter not found");
  }

  const result = await StatCounter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const createStatInDB = async (payload: IStatCounter) => {
  const result = await StatCounter.create(payload);
  return result;
};

export const StatService = {
  getAllStatsFromDB,
  updateStatInDB,
  createStatInDB,
};
