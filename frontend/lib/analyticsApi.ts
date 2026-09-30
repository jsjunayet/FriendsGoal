const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IAnalyticsOverview {
  totalAmounts: number;
  profits: number;
  membersReceived: number;
  othersReceived: number;
  dueAmounts: number;
  expenseAmounts: number;
}

export interface IMonthlyCollection {
  month: string;
  amount: number;
  isCurrent: boolean;
}

export const fetchAnalyticsOverview = async (): Promise<IAnalyticsOverview> => {
  const res = await fetch(`${BASE_URL}/analytics/overview`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const fetchMonthlyCollections = async (): Promise<IMonthlyCollection[]> => {
  const res = await fetch(`${BASE_URL}/analytics/monthly-collections?range=trailing12`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
