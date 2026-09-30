"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = exports.ExpenseCategory = void 0;
const mongoose_1 = require("mongoose");
// ─── Expense Category Schema ──────────────────────────────────────────────────
const expenseCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique: true,
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
});
exports.ExpenseCategory = (0, mongoose_1.model)("ExpenseCategory", expenseCategorySchema);
// ─── Expense Schema ───────────────────────────────────────────────────────────
const expenseSchema = new mongoose_1.Schema({
    expenseId: {
        type: Number,
        required: [true, "Expense ID is required"],
        unique: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Member",
        required: false,
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
    expenseHead: {
        type: String,
        required: [true, "Expense head is required"],
        trim: true,
    },
    expenseCategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ExpenseCategory",
        required: false,
    },
    expenseDate: {
        type: Date,
        required: [true, "Expense date is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be a positive number"],
    },
    remarks: {
        type: String,
        required: [true, "Remarks are required"],
        trim: true,
    },
    voucherNo: {
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
expenseSchema.statics.getNextExpenseId = async function () {
    const lastExpense = await this.findOne({}, { expenseId: 1 })
        .sort({ expenseId: -1 })
        .lean();
    return lastExpense && typeof lastExpense.expenseId === "number"
        ? lastExpense.expenseId + 1
        : 1;
};
exports.Expense = (0, mongoose_1.model)("Expense", expenseSchema);
//# sourceMappingURL=expense.model.js.map