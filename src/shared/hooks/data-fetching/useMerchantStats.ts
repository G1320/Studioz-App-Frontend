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
import { DEMO_USER_ID } from '@core/config/demo';
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

function useIsDemoUser(): boolean {
  const { user } = useUserContext();
  return user?._id === DEMO_USER_ID;
}

function statsEnabled(userId: string | undefined, isDemoUser: boolean): boolean {
  return isDemoUser || !!userId;
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
  const isDemoUser = useIsDemoUser();

  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  const query = useQuery({
    queryKey: ['merchantStats', isDemoUser, userId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoMerchantStats())
        : getMerchantStats({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser),
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
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantStudioAnalytics', isDemoUser, userId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoStudioAnalytics())
        : getStudioAnalytics({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch customer analytics (paginated, sortable)
 */
export const useCustomerAnalytics = (params: Partial<Omit<GetCustomerAnalyticsParams, 'startDate' | 'endDate'>> & { startDate?: Date; endDate?: Date } = {}) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: [
      'merchantCustomerAnalytics',
      isDemoUser,
      userId,
      startDateStr,
      endDateStr,
      params?.page,
      params?.limit,
      params?.sortBy,
      params?.search
    ],
    queryFn: () =>
      isDemoUser
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
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch single customer detail
 */
export const useCustomerDetail = (customerId: string | null, params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantCustomerDetail', isDemoUser, userId, customerId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoCustomerDetail(customerId!))
        : getCustomerDetail(customerId!, {
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser) && !!customerId,
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch projected earnings
 */
export const useProjections = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();

  return useQuery({
    queryKey: ['merchantProjections', isDemoUser, userId],
    queryFn: () =>
      isDemoUser ? Promise.resolve(getDemoProjections()) : getProjections({ userId }),
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch cancellation stats
 */
export const useCancellationStats = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantCancellationStats', isDemoUser, userId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoCancellationStats())
        : getCancellationStats({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch popular time slots
 */
export const usePopularTimeSlots = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantPopularTimeSlots', isDemoUser, userId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoPopularTimeSlots())
        : getPopularTimeSlots({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook to fetch revenue breakdown
 */
export const useRevenueBreakdown = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = useIsDemoUser();
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  return useQuery({
    queryKey: ['merchantRevenueBreakdown', isDemoUser, userId, startDateStr, endDateStr],
    queryFn: () =>
      isDemoUser
        ? Promise.resolve(getDemoRevenueBreakdown())
        : getRevenueBreakdown({
            userId,
            startDate: startDateStr,
            endDate: endDateStr
          }),
    enabled: statsEnabled(user?._id, isDemoUser),
    staleTime: 1000 * 60 * 5
  });
};
