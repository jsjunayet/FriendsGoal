import { Collection } from "../Operation/operation.model";
import { Expense } from "../Expense/expense.model";
import { Investment } from "../Investment/investment.model";
import { Member } from "../Member/member.model";
import { Adjustment } from "../Adjustment/adjustment.model";
import { Disbursement } from "../Disbursement/disbursement.model";
import { Withdrawal } from "../Withdrawal/withdrawal.model";

const getOverviewFromDB = async () => {
  const [
    collectionSum,
    expenseSum,
    memberDueSum,
    investmentIncomeSum,
    adjustmentProfitSum,
  ] = await Promise.all([
    Collection.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Expense.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Member.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$dueAmount" } } }]),
    Investment.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$profitAmount" } } }]), // Assuming profitAmount exists
    Adjustment.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: null, total: { $sum: "$adjustmentAmount" } } }]),
  ]);

  const parseDecimal = (val: any) => {
    if (!val) return 0;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    if (val.toString) return parseFloat(val.toString());
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

  const collections = await Collection.aggregate([
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

export const AnalyticsServices = {
  getOverviewFromDB,
  getMonthlyCollectionsFromDB,
};
