import { useQuery } from '@tanstack/react-query';
import { getMerchantStats, MerchantStats } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { DEMO_CLIENTS, DEMO_CHART_DATA } from '@core/config/demo';

interface UseMerchantStatsParams {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to fetch merchant statistics
 * Falls back to demo data if no real data is available or on error
 */
export const useMerchantStats = (params?: UseMerchantStatsParams) => {
  const { user } = useUserContext();
  
  // Convert dates to ISO strings for API
  const startDateStr = params?.startDate?.toISOString();
  const endDateStr = params?.endDate?.toISOString();

  const query = useQuery({
    queryKey: ['merchantStats', user?._id, startDateStr, endDateStr],
    queryFn: () => getMerchantStats({
      userId: user?._id || '',
      startDate: startDateStr,
      endDate: endDateStr
    }),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  // Check if we should use demo data
  const hasRealData = query.data && (
    query.data.totalBookings > 0 ||
    query.data.totalRevenue > 0 ||
    query.data.topClients.length > 0
  );

  // Create demo stats structure
  const demoStats: MerchantStats = {
    totalRevenue: 33670,
    totalBookings: 47,
    avgPerBooking: 716,
    newClients: 12,
    trends: {
      totalRevenue: '+18%',
      totalBookings: '+12%',
      avgPerBooking: '+5%',
      newClients: '+8%'
    },
    isPositive: {
      totalRevenue: true,
      totalBookings: true,
      avgPerBooking: true,
      newClients: true
    },
    quickStats: {
      avgSessionTime: 2.5,
      occupancy: 68,
      studios: [
        { studioId: 'demo-1', name: 'אולפן A', occupancy: 75 },
        { studioId: 'demo-2', name: 'אולפן B', occupancy: 61 }
      ]
    },
    topClients: DEMO_CLIENTS.map(c => ({
      id: c.id,
      name: c.name,
      totalSpent: c.totalSpent,
      bookingsCount: Math.floor(c.totalSpent / 300),
      lastVisit: c.lastVisit,
      avatarUrl: c.avatarUrl
    })),
    revenueByPeriod: DEMO_CHART_DATA
  };

  return {
    data: hasRealData ? query.data : (query.isError || !query.data ? demoStats : query.data),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isDemo: !hasRealData
  };
};
