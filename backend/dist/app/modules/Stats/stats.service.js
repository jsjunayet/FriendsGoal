"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatService = void 0;
const stats_model_1 = require("./stats.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
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
    let stats = await stats_model_1.StatCounter.find({ isDeleted: false }).sort({ order: 1, createdAt: 1 });
    if (stats.length === 0) {
        try {
            await stats_model_1.StatCounter.insertMany(DEFAULT_STATS);
            stats = await stats_model_1.StatCounter.find({ isDeleted: false }).sort({ order: 1, createdAt: 1 });
        }
        catch {
            // In case of concurrent seed or race condition
            return DEFAULT_STATS;
        }
    }
    return stats;
};
const updateStatInDB = async (id, payload) => {
    const stat = await stats_model_1.StatCounter.findOne({ _id: id, isDeleted: false });
    if (!stat) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Stat counter not found");
    }
    const result = await stats_model_1.StatCounter.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const bulkUpsertStatsInDB = async (payload) => {
    // If array of stats: [{ key, value, label, order }]
    if (Array.isArray(payload)) {
        const operations = payload.map((item) => {
            const updateData = { value: item.value, isDeleted: false };
            if (item.label)
                updateData.label = item.label;
            if (item.order !== undefined)
                updateData.order = item.order;
            return stats_model_1.StatCounter.findOneAndUpdate({ key: item.key }, { $set: updateData }, { upsert: true, new: true, setDefaultsOnInsert: true });
        });
        await Promise.all(operations);
    }
    else if (typeof payload === "object" && payload !== null) {
        // If object map: { active_members: "111+", projects: "70+", years_serving: "3+" }
        const entries = Object.entries(payload);
        const operations = entries.map(([key, val]) => {
            const valueStr = typeof val === "object" && val !== null ? val.value : String(val);
            const labelObj = typeof val === "object" && val !== null && val.label ? val.label : undefined;
            const updateData = { value: valueStr, isDeleted: false };
            if (labelObj)
                updateData.label = labelObj;
            return stats_model_1.StatCounter.findOneAndUpdate({ key }, { $set: updateData }, { upsert: true, new: true, setDefaultsOnInsert: true });
        });
        await Promise.all(operations);
    }
    return getAllStatsFromDB();
};
const createStatInDB = async (payload) => {
    const result = await stats_model_1.StatCounter.create(payload);
    return result;
};
exports.StatService = {
    getAllStatsFromDB,
    updateStatInDB,
    bulkUpsertStatsInDB,
    createStatInDB,
};
//# sourceMappingURL=stats.service.js.map