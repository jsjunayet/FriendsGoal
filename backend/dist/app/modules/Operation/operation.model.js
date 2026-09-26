"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ledger = exports.MonthlyBill = exports.Collection = void 0;
const mongoose_1 = require("mongoose");
// ─── 1. Collection Schema ─────────────────────────────────────────────────────
const collectionSchema = new mongoose_1.Schema({
    member: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Member ID is required"],
    },
    memberCode: {
        type: String,
        required: [true, "Member Code is required"],
        trim: true,
    },
    memberName: {
        type: String,
        required: [true, "Member Name is required"],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be at least 1"],
    },
    receiptNo: {
        type: String,
        required: [true, "Receipt No is required"],
        unique: true,
        trim: true,
    },
    month: {
        type: String,
        required: [true, "Month is required"],
        trim: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "bank", "mobile_banking"],
        default: "cash",
    },
    status: {
        type: String,
        enum: ["Paid", "Due", "Advance"],
        default: "Paid",
    },
    note: {
        type: String,
        trim: true,
    },
    receivedBy: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
collectionSchema.index({ member: 1, createdAt: -1 });
collectionSchema.index({ memberCode: 1, createdAt: -1 });
collectionSchema.index({ month: 1 });
collectionSchema.index({ receiptNo: 1 });
exports.Collection = (0, mongoose_1.model)("Collection", collectionSchema);
// ─── 2. Monthly Bill Schema ───────────────────────────────────────────────────
const monthlyBillSchema = new mongoose_1.Schema({
    member: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Member ID is required"],
    },
    memberCode: {
        type: String,
        required: [true, "Member Code is required"],
        trim: true,
    },
    memberName: {
        type: String,
        required: [true, "Member Name is required"],
        trim: true,
    },
    billingMonth: {
        type: String,
        required: [true, "Billing Month is required"],
        trim: true,
    },
    amount: {
        type: Number,
        default: 1000,
    },
    status: {
        type: String,
        enum: ["Paid", "Due", "Advance"],
        default: "Due",
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    dueAmount: {
        type: Number,
        default: 1000,
    },
}, {
    timestamps: true,
});
monthlyBillSchema.index({ member: 1, billingMonth: 1 }, { unique: true });
monthlyBillSchema.index({ memberCode: 1, billingMonth: 1 });
exports.MonthlyBill = (0, mongoose_1.model)("MonthlyBill", monthlyBillSchema);
// ─── 3. Ledger Schema ─────────────────────────────────────────────────────────
const ledgerSchema = new mongoose_1.Schema({
    member: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Member ID is required"],
    },
    memberCode: {
        type: String,
        required: [true, "Member Code is required"],
        trim: true,
    },
    type: {
        type: String,
        enum: ["deposit", "monthly_fee", "due_payment", "adjustment"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    previousDue: {
        type: Number,
        default: 0,
    },
    newDue: {
        type: Number,
        default: 0,
    },
    previousAdvance: {
        type: Number,
        default: 0,
    },
    newAdvance: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
ledgerSchema.index({ member: 1, createdAt: -1 });
exports.Ledger = (0, mongoose_1.model)("Ledger", ledgerSchema);
//# sourceMappingURL=operation.model.js.map