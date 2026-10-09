"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatCounter = void 0;
const mongoose_1 = require("mongoose");
const statCounterSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    label: {
        bn: { type: String, required: true, trim: true },
        en: { type: String, required: true, trim: true },
    },
    value: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: "__v",
});
exports.StatCounter = (0, mongoose_1.model)("StatCounter", statCounterSchema);
//# sourceMappingURL=stats.model.js.map