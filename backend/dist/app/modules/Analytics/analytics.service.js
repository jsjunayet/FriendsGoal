"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const operation_model_1 = require("../Operation/operation.model");
const expense_model_1 = require("../Expense/expense.model");
const investment_model_1 = require("../Investment/investment.model");
const member_model_1 = require("../Member/member.model");
const adjustment_model_1 = require("../Adjustment/adjustment.model");
const getOverviewFromDB = async () => {
    const [collectionSum, expenseSum, memberDueSum, investmentIncomeSum, adjustmentProfitSum,] = await Promise.all([
        operation_model_1.Collection.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
        expense_model_1.Expense.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
        member_model_1.Member.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$dueAmount" } } }]),
        investment_model_1.Investment.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$profitAmount" } } }]), // Assuming profitAmount exists
        adjustment_model_1.Adjustment.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$adjustmentAmount" } } }]),
    ]);
    const parseDecimal = (val) => {
        if (!val)
            return 0;
        if (val.$numberDecimal)
            return parseFloat(val.$numberDecimal);
        if (val.toString)
            return parseFloat(val.toString());
        return Number(val) || 0;
    };
    const membersReceived = parseDecimal(collectionSum[0]?.total);
    const othersReceived = parseDecimal(investmentIncomeSum[0]?.total);
    const profits = parseDecimal(adjustmentProfitSum[0]?.total);
    const totalAmounts = membersReceived + othersReceived + profits;
    const dueAmounts = parseDecimal(memberDueSum[0]?.total);
    const expenseAmounts = parseDecimal(expenseSum[0]?.total);
    return {
        totalAmounts,
        profits,
        membersReceived,
        othersReceived,
        dueAmounts,
        expenseAmounts,
    };
};
const getMonthlyCollectionsFromDB = async () => {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const collections = await operation_model_1.Collection.aggregate([
        {
            $match: {
                status: "Paid",
                paymentDate: { $gte: twelveMonthsAgo, $lte: now },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$paymentDate" },
                    month: { $month: "$paymentDate" },
                },
                total: { $sum: "$amount" },
            },
        },
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mName = monthNames[d.getMonth()];
        const mYear = d.getFullYear();
        const mMonth = d.getMonth() + 1;
        const found = collections.find(c => c._id.year === mYear && c._id.month === mMonth);
        result.push({
            month: mName,
            amount: found ? found.total : 0,
            isCurrent: i === 0,
        });
    }
    return result;
};
exports.AnalyticsServices = {
    getOverviewFromDB,
    getMonthlyCollectionsFromDB,
};
//# sourceMappingURL=analytics.service.js.map