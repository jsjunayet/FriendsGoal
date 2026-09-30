"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = exports.generateWithdrawalReferenceId = void 0;
const mongoose_1 = require("mongoose");
const withdrawalSchema = new mongoose_1.Schema({
    referenceId: {
        type: String,
        required: [true, "Reference ID is required"],
        unique: true,
        trim: true,
        index: true,
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
    amount: {
        type: Number,
        required: [true, "Withdrawal amount is required"],
        min: [1, "Amount must be at least 1"],
    },
    method: {
        type: String,
        enum: ["Mobile Banking", "Bank Transfer", "Cash Pickup"],
        default: "Mobile Banking",
    },
    accountDetails: {
        type: String,
        trim: true,
    },
    reason: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
        index: true,
    },
    adminNote: {
        type: String,
        trim: true,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    reviewedByName: {
        type: String,
        trim: true,
    },
    reviewedAt: {
        type: Date,
        required: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
withdrawalSchema.index({ status: 1, memberId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });
const generateWithdrawalReferenceId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `WD-${code}`;
};
exports.generateWithdrawalReferenceId = generateWithdrawalReferenceId;
exports.Withdrawal = (0, mongoose_1.model)("Withdrawal", withdrawalSchema);
//# sourceMappingURL=withdrawal.model.js.map