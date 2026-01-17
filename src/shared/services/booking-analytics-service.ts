import { httpService } from './http-service';

// ============================================================
// TYPES
// ============================================================

export interface TimeSlotAnalytics {
  slot: string;
  bookings: number;
  revenue: number;
  percentage: number;
}

export interface DayAnalytics {
  day: string;
  dayIndex: number;
  bookings: number;
  revenue: number;
  percentage: number;
}

export interface PopularTimeSlotsResponse {
  timeSlots: TimeSlotAnalytics[];
  byDay: DayAnalytics[];
}

export interface CancellationStats {
  totalCancelled: number;
  cancellationRate: number;
  cancelledRevenue: number;
  topCancellationReasons: { reason: string; count: number }[];
  cancellationsByDay: number[];
  trend: string;
  isPositive: boolean;
}

export interface RepeatCustomerStats {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgBookingsPerRepeat: number;
  repeatCustomerRevenue: number;
  revenuePercentage: number;
  topRepeatCustomers: {
    id: string;
    name: string;
    bookings: number;
    totalSpent: number;
    lastVisit: string;
  }[];
}

export interface AnalyticsDateRange {
  startDate?: string;
  endDate?: string;
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get popular time slots analysis for a merchant
 */
export const getPopularTimeSlots = async (
  userId: string,
  dateRange?: AnalyticsDateRange
): Promise<PopularTimeSlotsResponse> => {
  const params: Record<string, string> = { userId };

  if (dateRange?.startDate) params.startDate = dateRange.startDate;
  if (dateRange?.endDate) params.endDate = dateRange.endDate;

  return httpService.get<PopularTimeSlotsResponse>('/merchant/analytics/time-slots', params);
};

/**
 * Get cancellation statistics for a merchant
 */
export const getCancellationStats = async (
  userId: string,
  dateRange?: AnalyticsDateRange
): Promise<CancellationStats> => {
  const params: Record<string, string> = { userId };

  if (dateRange?.startDate) params.startDate = dateRange.startDate;
  if (dateRange?.endDate) params.endDate = dateRange.endDate;

  return httpService.get<CancellationStats>('/merchant/analytics/cancellations', params);
};

/**
 * Get repeat customer statistics for a merchant
 */
export const getRepeatCustomerStats = async (
  userId: string,
  dateRange?: AnalyticsDateRange
): Promise<RepeatCustomerStats> => {
  const params: Record<string, string> = { userId };

  if (dateRange?.startDate) params.startDate = dateRange.startDate;
  if (dateRange?.endDate) params.endDate = dateRange.endDate;

  return httpService.get<RepeatCustomerStats>('/merchant/analytics/repeat-customers', params);
};

/**
 * Get all analytics data in parallel
 */
export const getAllAnalytics = async (
  userId: string,
  dateRange?: AnalyticsDateRange
): Promise<{
  timeSlots: PopularTimeSlotsResponse;
  cancellations: CancellationStats;
  repeatCustomers: RepeatCustomerStats;
}> => {
  const [timeSlots, cancellations, repeatCustomers] = await Promise.all([
    getPopularTimeSlots(userId, dateRange),
    getCancellationStats(userId, dateRange),
    getRepeatCustomerStats(userId, dateRange)
  ]);

  return { timeSlots, cancellations, repeatCustomers };
};

export const bookingAnalyticsService = {
  getPopularTimeSlots,
  getCancellationStats,
  getRepeatCustomerStats,
  getAllAnalytics
};

export default bookingAnalyticsService;
