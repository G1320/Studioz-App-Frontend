import { httpService } from './http-service';

// --- Types ---

export interface TopClient {
  id: string;
  name: string;
  totalSpent: number;
  bookingsCount: number;
  lastVisit: string;
  avatarUrl?: string;
}

export interface StudioOccupancy {
  studioId: string;
  name: string;
  occupancy: number;
}

export interface MerchantStats {
  totalRevenue: number;
  revenueNet?: number;
  totalCouponDiscounts?: number;
  conversionRate?: number;
  totalBookings: number;
  avgPerBooking: number;
  newClients: number;
  trends: {
    totalRevenue: string;
    totalBookings: string;
    avgPerBooking: string;
    newClients: string;
  };
  isPositive: {
    totalRevenue: boolean;
    totalBookings: boolean;
    avgPerBooking: boolean;
    newClients: boolean;
  };
  quickStats: {
    avgSessionTime: number;
    occupancy: number;
    studios: StudioOccupancy[];
  };
  topClients: TopClient[];
  revenueByPeriod: {
    monthly: number[];
    weekly: number[];
    daily: number[];
  };
}

export type DocStatus = 'paid' | 'pending' | 'overdue' | 'draft';
export type DocType = 'invoice' | 'credit_note' | 'receipt' | 'contract';

export interface MerchantDocument {
  id: string;
  externalId: string;
  number: string;
  type: DocType;
  studioId?: string;
  studioName: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: DocStatus;
  customerName: string;
  customerEmail?: string;
  documentUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface DocumentsStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalDocs: number;
}

export interface MerchantDocumentsResponse {
  documents: MerchantDocument[];
  stats: DocumentsStats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface GetDocumentsParams {
  userId: string;
  page?: number;
  limit?: number;
  status?: DocStatus | 'all';
  studioId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetStatsParams {
  userId: string;
  startDate?: string;
  endDate?: string;
}

// --- API Functions ---

/**
 * Get merchant statistics for dashboard
 */
export const getMerchantStats = async (params: GetStatsParams): Promise<MerchantStats> => {
  return httpService.get<MerchantStats>('/merchant/stats', params);
};

/**
 * Get merchant documents (invoices, receipts, etc.)
 */
export const getMerchantDocuments = async (params: GetDocumentsParams): Promise<MerchantDocumentsResponse> => {
  return httpService.get<MerchantDocumentsResponse>('/merchant/documents', params);
};

/**
 * Get a single document by ID
 */
export const getMerchantDocument = async (id: string): Promise<MerchantDocument> => {
  return httpService.get<MerchantDocument>(`/merchant/documents/${id}`);
};

// ============================================================
// ANALYTICS TYPES & FUNCTIONS
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

/**
 * Get popular time slots analysis
 */
export const getPopularTimeSlots = async (params: GetStatsParams): Promise<PopularTimeSlotsResponse> => {
  return httpService.get<PopularTimeSlotsResponse>('/merchant/analytics/time-slots', params);
};

/**
 * Get cancellation statistics
 */
export const getCancellationStats = async (params: GetStatsParams): Promise<CancellationStats> => {
  return httpService.get<CancellationStats>('/merchant/analytics/cancellations', params);
};

/**
 * Get repeat customer statistics
 */
export const getRepeatCustomerStats = async (params: GetStatsParams): Promise<RepeatCustomerStats> => {
  return httpService.get<RepeatCustomerStats>('/merchant/analytics/repeat-customers', params);
};

/**
 * Get all analytics data in parallel
 */
export const getAllAnalytics = async (params: GetStatsParams): Promise<{
  timeSlots: PopularTimeSlotsResponse;
  cancellations: CancellationStats;
  repeatCustomers: RepeatCustomerStats;
}> => {
  const [timeSlots, cancellations, repeatCustomers] = await Promise.all([
    getPopularTimeSlots(params),
    getCancellationStats(params),
    getRepeatCustomerStats(params)
  ]);

  return { timeSlots, cancellations, repeatCustomers };
};

// ============================================================
// STUDIO ANALYTICS
// ============================================================

export interface StudioAnalyticsItem {
  itemId: string;
  name: string;
  bookings: number;
  revenue: number;
}

export interface StudioAnalyticsTopCustomer {
  id: string;
  name: string;
  totalSpent: number;
  bookingsCount: number;
}

export interface StudioAnalyticsRow {
  studioId: string;
  studioName: string;
  revenue: number;
  bookingCount: number;
  avgBookingValue: number;
  occupancy: number;
  topItems: StudioAnalyticsItem[];
  growthTrend: string;
  topCustomers: StudioAnalyticsTopCustomer[];
}

export const getStudioAnalytics = async (params: GetStatsParams): Promise<{ studios: StudioAnalyticsRow[] }> => {
  return httpService.get<{ studios: StudioAnalyticsRow[] }>('/merchant/analytics/studios', params);
};

// ============================================================
// CUSTOMER ANALYTICS
// ============================================================

export type ChurnRisk = 'low' | 'medium' | 'high';

export interface CustomerAnalyticsRow {
  customerId: string;
  customerName: string;
  avatarUrl?: string;
  lifetimeValue: number;
  bookingCount: number;
  avgSpendPerVisit: number;
  firstVisit: string;
  lastVisit: string;
  favoriteStudio: string;
  favoriteItem: string;
  visitFrequency: number;
  churnRisk: ChurnRisk;
}

export interface GetCustomerAnalyticsParams extends GetStatsParams {
  page?: number;
  limit?: number;
  sortBy?: 'totalSpent' | 'bookings' | 'lastVisit';
  search?: string;
}

export interface CustomerAnalyticsResponse {
  customers: CustomerAnalyticsRow[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const getCustomerAnalytics = async (params: GetCustomerAnalyticsParams): Promise<CustomerAnalyticsResponse> => {
  return httpService.get<CustomerAnalyticsResponse>('/merchant/analytics/customers', params);
};

export interface CustomerDetailBooking {
  id: string;
  date: string;
  studioName: string;
  itemName: string;
  price: number;
  status: string;
}

export interface CustomerDetailResponse {
  customerId: string;
  bookingHistory: CustomerDetailBooking[];
  spendingTrend: number[];
  preferredTimeSlots: string[];
  preferredDays: string[];
}

export const getCustomerDetail = async (
  customerId: string,
  params: GetStatsParams
): Promise<CustomerDetailResponse> => {
  return httpService.get<CustomerDetailResponse>(`/merchant/analytics/customers/${customerId}`, params);
};

// ============================================================
// PROJECTIONS
// ============================================================

export interface ProjectionsResponse {
  confirmedUpcoming: number;
  projectedMonthly: number[];
  monthlyActuals: number[];
  projectedLine: number[];
  confidence: 'high' | 'medium' | 'low';
}

export const getProjections = async (params: Pick<GetStatsParams, 'userId'>): Promise<ProjectionsResponse> => {
  return httpService.get<ProjectionsResponse>('/merchant/analytics/projections', params);
};

// ============================================================
// REVENUE BREAKDOWN
// ============================================================

export interface RevenueBreakdownResponse {
  byStudio: { name: string; revenue: number; percentage: number }[];
  byItem: { name: string; studioName: string; revenue: number; bookings: number; percentage: number }[];
  byDayOfWeek: { day: string; dayIndex: number; revenue: number; bookings: number }[];
  byTimeOfDay: { hour: number; revenue: number; bookings: number }[];
  couponImpact: {
    totalDiscounts: number;
    avgDiscountPercent: number;
    bookingsWithCoupon: number;
    bookingsWithoutCoupon: number;
  };
}

export const getRevenueBreakdown = async (params: GetStatsParams): Promise<RevenueBreakdownResponse> => {
  return httpService.get<RevenueBreakdownResponse>('/merchant/analytics/revenue-breakdown', params);
};
