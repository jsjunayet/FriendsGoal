"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const operation_model_1 = require("../Operation/operation.model");
const expense_model_1 = require("../Expense/expense.model");
const investmentIncome_model_1 = require("../InvestmentIncome/investmentIncome.model");
const member_model_1 = require("../Member/member.model");
const getOverviewFromDB = async () => {
    const [memberDepositSum, expenseSum, memberDueSum, investmentIncomeSum, memberOthersSum,] = await Promise.all([
        member_model_1.Member.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$totalDeposit" } } },
        ]),
        expense_model_1.Expense.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        member_model_1.Member.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$dueAmount" } } },
        ]),
        investmentIncome_model_1.InvestmentIncome.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        member_model_1.Member.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$othersReceived" } } },
        ]),
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
    const membersReceived = parseDecimal(memberDepositSum[0]?.total);
    const othersReceived = parseDecimal(memberOthersSum[0]?.total);
    const profits = parseDecimal(investmentIncomeSum[0]?.total);
    const expenseAmounts = parseDecimal(expenseSum[0]?.total);
    const totalAmounts = (membersReceived + othersReceived + profits) - expenseAmounts;
    const dueAmounts = parseDecimal(memberDueSum[0]?.total);
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