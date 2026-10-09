import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  memberDashboardApi,
  IMemberDashboardSummary,
  IWithdrawalRequestPayload,
} from "../memberDashboardApi";

export const MEMBER_DASHBOARD_QUERY_KEY = ["member", "dashboard-summary"];
export const MEMBER_PROFIT_QUERY_KEY = ["member", "profit-balance"];

export function useMemberDashboard() {
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: MEMBER_DASHBOARD_QUERY_KEY,
    queryFn: () => memberDashboardApi.getDashboardSummary(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const profitQuery = useQuery({
    queryKey: MEMBER_PROFIT_QUERY_KEY,
    queryFn: () => memberDashboardApi.getProfitBalance(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const withdrawalMutation = useMutation({
    mutationFn: (payload: IWithdrawalRequestPayload) =>
      memberDashboardApi.submitWithdrawalRequest(payload),
    onSuccess: () => {
      // Invalidate both summary and profit balance queries to refresh data across all views
      queryClient.invalidateQueries({ queryKey: MEMBER_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEMBER_PROFIT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });

  return {
    summary: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    refetchSummary: summaryQuery.refetch,
    profitBalance:
      profitQuery.data?.profitBalance ?? summaryQuery.data?.profitBalance ?? 0,
    isProfitLoading: profitQuery.isLoading,
    submitWithdrawal: withdrawalMutation.mutateAsync,
    isWithdrawalSubmitting: withdrawalMutation.isPending,
  };
}
