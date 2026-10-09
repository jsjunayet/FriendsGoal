"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentIncome = void 0;
const mongoose_1 = require("mongoose");
const investmentIncomeSchema = new mongoose_1.Schema({
    numericId: {
        type: Number,
        required: true,
        unique: true,
    },
    investmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Investment",
        required: true,
    },
    investmentName: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    remarks: {
        type: String,
        required: true,
        trim: true,
    },
    distributedToCount: {
        type: Number,
        default: 0,
    },
    perMemberProfit: {
        type: Number,
        default: 0,
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
}, { timestamps: true });
investmentIncomeSchema.statics.getNextNumericId = async function () {
    const last = await this.findOne({}, { numericId: 1 }).sort({ numericId: -1 }).lean();
    return last && typeof last.numericId === "number" ? last.numericId + 1 : 1;
};
exports.InvestmentIncome = (0, mongoose_1.model)("InvestmentIncome", investmentIncomeSchema);
//# sourceMappingURL=investmentIncome.model.js.map