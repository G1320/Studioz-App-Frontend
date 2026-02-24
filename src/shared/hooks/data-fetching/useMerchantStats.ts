import { useQuery } from '@tanstack/react-query';
import {
  getMerchantStats,
  getStudioAnalytics,
  getCustomerAnalytics,
  getCustomerDetail,
  getProjections,
  getRevenueBreakdown,
  getCancellationStats,
  getPopularTimeSlots,
  type GetCustomerAnalyticsParams
} from '@shared/services';
import { useUserContext } from '@core/contexts';
import {
  getDemoMerchantStats,
  getDemoStudioAnalytics,
  getDemoCustomerAnalytics,
  getDemoCustomerDetail,
  getDemoProjections,
  getDemoRevenueBreakdown,
  getDemoCancellationStats,
  getDemoPopularTimeSlots
} from '@core/config/demo/merchantStatsDemoData';

/**
 * Toggle demo vs real data for the merchant stats dashboard.
 * - true  = use fixture data (no API, no backend seed needed)
 * - false = use real API with the logged-in user's data
 * File: Frontend/src/shared/hooks/data-fetching/useMerchantStats.ts
 */
const USE_DEMO_DATA = true;

function statsEnabled(userId: string | undefined): boolean {
  return USE_DEMO_DATA || !!userId;
}

interface UseMerchantStatsParams {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to fetch merchant statistics
 */
export const useMerchantStats = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';

  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  const query = useQuery({
    queryKey: ['merchantStats', USE_DEMO_DATA, userId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoMerchantStats())
        : getMerchantStats({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

/**
 * Hook to fetch per-studio analytics
 */
export const useStudioAnalytics = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantStudioAnalytics', USE_DEMO_DATA, userId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoStudioAnalytics())
        : getStudioAnalytics({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch customer analytics (paginated, sortable)
 */
export const useCustomerAnalytics = (params: Partial<Omit<GetCustomerAnalyticsParams, 'startDate' | 'endDate'>> & { startDate?: Date; endDate?: Date } = {}) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: [
      'merchantCustomerAnalytics',
      USE_DEMO_DATA,
      userId,
      startDateStr,
      endDateStr,
      params?.page,
      params?.limit,
      params?.sortBy,
      params?.search
    ],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(
            getDemoCustomerAnalytics({
              page: params?.page,
              limit: params?.limit,
              sortBy: params?.sortBy,
              search: params?.search
            })
          )
        : getCustomerAnalytics({
            userId,
            startDate: startDateStr,
            endDate: endDateStr,
            page: params?.page,
            limit: params?.limit,
            sortBy: params?.sortBy,
            search: params?.search
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch single customer detail
 */
export const useCustomerDetail = (customerId: string | null, params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantCustomerDetail', USE_DEMO_DATA, userId, customerId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoCustomerDetail(customerId!))
        : getCustomerDetail(customerId!, {
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id) && !!customerId,
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch projected earnings
 */
export const useProjections = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';

  return useQuery({
    queryKey: ['merchantProjections', USE_DEMO_DATA, userId],
    queryFn: () =>
      USE_DEMO_DATA ? Promise.resolve(getDemoProjections()) : getProjections({ userId }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch cancellation stats
 */
export const useCancellationStats = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantCancellationStats', USE_DEMO_DATA, userId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoCancellationStats())
        : getCancellationStats({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch popular time slots
 */
export const usePopularTimeSlots = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantPopularTimeSlots', USE_DEMO_DATA, userId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoPopularTimeSlots())
        : getPopularTimeSlots({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch revenue breakdown
 */
export const useRevenueBreakdown = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantRevenueBreakdown', USE_DEMO_DATA, userId, startDateStr, endDateStr],
    queryFn: () =>
      USE_DEMO_DATA
        ? Promise.resolve(getDemoRevenueBreakdown())
        : getRevenueBreakdown({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id),
    staleTime: 1000 * 60 * 5
  });
};
