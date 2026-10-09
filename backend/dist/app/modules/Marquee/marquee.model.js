"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marquee = void 0;
const mongoose_1 = require("mongoose");
const marqueeSchema = new mongoose_1.Schema({
    headline: {
        en: { type: String, required: true },
        bn: { type: String, required: true },
    },
    targetLink: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual aliases for text and link
marqueeSchema.virtual("text").get(function () {
    return this.headline;
});
marqueeSchema.virtual("link").get(function () {
    return this.targetLink;
});
// Middleware pre-validation to sanitize incoming payload for headline/text and targetLink/link
marqueeSchema.pre("validate", function () {
    if (!this.headline && this.text) {
        this.headline = this.text;
    }
    if (!this.targetLink && this.link) {
        this.targetLink = this.link;
    }
});
exports.Marquee = (0, mongoose_1.model)("MarqueeTicker", marqueeSchema);
//# sourceMappingURL=marquee.model.js.map