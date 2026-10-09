import { StatCounter } from "./stats.model";
import type { IStatCounter } from "./stats.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const DEFAULT_STATS = [
  {
    key: "active_members",
    label: { bn: "সক্রিয় সদস্য", en: "ACTIVE MEMBERS" },
    value: "111+",
    order: 1,
  },
  {
    key: "projects",
    label: { bn: "চলমান ও সফল প্রকল্প", en: "PROJECTS" },
    value: "70+",
    order: 2,
  },
  {
    key: "years_serving",
    label: { bn: "সেবার বছর", en: "YEARS SERVING" },
    value: "3+",
    order: 3,
  },
];

const getAllStatsFromDB = async () => {
  let stats = await StatCounter.find({ isDeleted: false }).sort({ order: 1, createdAt: 1 });
  if (stats.length === 0) {
    try {
      await StatCounter.insertMany(DEFAULT_STATS);
      stats = await StatCounter.find({ isDeleted: false }).sort({ order: 1, createdAt: 1 });
    } catch {
      // In case of concurrent seed or race condition
      return DEFAULT_STATS;
    }
  }
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

const bulkUpsertStatsInDB = async (payload: any) => {
  // If array of stats: [{ key, value, label, order }]
  if (Array.isArray(payload)) {
    const operations = payload.map((item) => {
      const updateData: any = { value: item.value, isDeleted: false };
      if (item.label) updateData.label = item.label;
      if (item.order !== undefined) updateData.order = item.order;

      return StatCounter.findOneAndUpdate(
        { key: item.key },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });
    await Promise.all(operations);
  } else if (typeof payload === "object" && payload !== null) {
    // If object map: { active_members: "111+", projects: "70+", years_serving: "3+" }
    const entries = Object.entries(payload);
    const operations = entries.map(([key, val]) => {
      const valueStr = typeof val === "object" && val !== null ? (val as any).value : String(val);
      const labelObj = typeof val === "object" && val !== null && (val as any).label ? (val as any).label : undefined;
      const updateData: any = { value: valueStr, isDeleted: false };
      if (labelObj) updateData.label = labelObj;

      return StatCounter.findOneAndUpdate(
        { key },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });
    await Promise.all(operations);
  }

  return getAllStatsFromDB();
};

const createStatInDB = async (payload: IStatCounter) => {
  const result = await StatCounter.create(payload);
  return result;
};

export const StatService = {
  getAllStatsFromDB,
  updateStatInDB,
  bulkUpsertStatsInDB,
  createStatInDB,
};
