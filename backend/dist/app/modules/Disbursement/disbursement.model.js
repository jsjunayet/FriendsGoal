"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disbursement = void 0;
const mongoose_1 = require("mongoose");
const disbursementSchema = new mongoose_1.Schema({
    disbursementId: {
        type: String,
        required: [true, "Disbursement ID is required"],
        unique: true,
        trim: true,
    },
    numericId: {
        type: Number,
        required: [true, "Numeric ID is required"],
        unique: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Member ID is required"],
    },
    memberName: {
        type: String,
        required: [true, "Member name is required"],
        trim: true,
    },
    memberCode: {
        type: String,
        trim: true,
    },
    disbursedAmount: {
        type: Number,
        required: [true, "Disbursed amount is required"],
        min: [0, "Amount must be a positive number"],
    },
    disbursDate: {
        type: Date,
        required: [true, "Disbursement date is required"],
        default: Date.now,
    },
    remarks: {
        type: String,
        trim: true,
        default: "Profit Disbursement Payout",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
}, {
    timestamps: true,
});
disbursementSchema.statics.getNextDisbursementId = async function () {
    const last = await this.findOne({}, { numericId: 1 })
        .sort({ numericId: -1 })
        .lean();
    const nextNumeric = last && typeof last.numericId === "number"
        ? Math.max(101, last.numericId + 1)
        : 101;
    const disbursementId = String(nextNumeric);
    return { disbursementId, numericId: nextNumeric };
};
exports.Disbursement = (0, mongoose_1.model)("Disbursement", disbursementSchema);
//# sourceMappingURL=disbursement.model.js.map