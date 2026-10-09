"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleForm = void 0;
const mongoose_1 = require("mongoose");
const googleFormSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    embedUrl: {
        type: String,
        required: true,
        trim: true,
    },
    rawInput: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
        index: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
exports.GoogleForm = (0, mongoose_1.model)("GoogleForm", googleFormSchema);
//# sourceMappingURL=googleForm.model.js.map