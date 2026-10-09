"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adjustment = void 0;
const mongoose_1 = require("mongoose");
const adjustmentBalanceSnapshotSchema = new mongoose_1.Schema({
    totalDeposit: { type: Number, default: 0 },
    savingsBalance: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    profitBalance: { type: Number, default: 0 },
}, { _id: false });
const adjustmentSchema = new mongoose_1.Schema({
    adjustmentId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Member ID is required"],
        index: true,
    },
    memberCode: {
        type: String,
        required: true,
        trim: true,
    },
    memberName: {
        type: String,
        required: true,
        trim: true,
    },
    adjustmentType: {
        type: String,
        enum: [
            "ADD",
            "SUB",
            "OTHER_RECEIVED",
        ],
        required: [true, "Adjustment type is required"],
    },
    adjustmentTypeName: {
        type: String,
        required: true,
        trim: true,
    },
    adjustmentDate: {
        type: Date,
        required: [true, "Adjustment date is required"],
        default: Date.now,
        index: true,
    },
    adjustmentAmount: {
        type: Number,
        required: [true, "Adjustment amount is required"],
        min: [0.01, "Amount must be greater than zero"],
    },
    signedAmount: {
        type: Number,
        required: true,
    },
    previousBalance: {
        type: adjustmentBalanceSnapshotSchema,
        required: true,
    },
    updatedBalance: {
        type: adjustmentBalanceSnapshotSchema,
        required: true,
    },
    remarks: {
        type: String,
        required: [true, "Remarks are required for audit justification"],
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
adjustmentSchema.index({ adjustmentDate: -1, createdAt: -1 });
exports.Adjustment = (0, mongoose_1.model)("Adjustment", adjustmentSchema);
//# sourceMappingURL=adjustment.model.js.map