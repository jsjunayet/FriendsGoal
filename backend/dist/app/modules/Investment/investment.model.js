"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investment = void 0;
const mongoose_1 = require("mongoose");
const investmentSchema = new mongoose_1.Schema({
    investmentId: {
        type: String,
        required: [true, "Investment ID is required"],
        unique: true,
        trim: true,
    },
    numericId: {
        type: Number,
        required: [true, "Numeric ID is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Investment name is required"],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be greater than or equal to 0"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        default: null,
    },
    remarks: {
        type: String,
        required: [true, "Remarks are required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["Running", "Closed"],
        default: "Running",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: false,
    },
    memberName: {
        type: String,
        trim: true,
    },
    memberCode: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
investmentSchema.statics.getNextInvestmentId = async function () {
    const last = await this.findOne({}, { numericId: 1 })
        .sort({ numericId: -1 })
        .lean();
    const nextNumeric = last && typeof last.numericId === "number" ? last.numericId + 1 : 1;
    const investmentId = String(nextNumeric).padStart(3, "0");
    return { investmentId, numericId: nextNumeric };
};
exports.Investment = (0, mongoose_1.model)("Investment", investmentSchema);
//# sourceMappingURL=investment.model.js.map