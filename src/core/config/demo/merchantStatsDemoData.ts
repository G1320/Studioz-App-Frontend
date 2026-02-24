/**
 * Highly realistic demo data for the merchant stats / analytics dashboard.
 * When VITE_DEMO_STATS_USER_ID=demo, the stats hooks use these fixtures instead of the API
 * so the UI is fully populated for demo videos without running the backend seed.
 */

import type {
  MerchantStats,
  StudioAnalyticsRow,
  CustomerAnalyticsRow,
  CustomerDetailResponse,
  ProjectionsResponse,
  RevenueBreakdownResponse,
  CancellationStats,
  PopularTimeSlotsResponse,
  RepeatCustomerStats
} from '@shared/services';

// Build last 12 months revenue (index 0 = 11 months ago, index 11 = current month) – realistic curve
function buildMonthlyRevenue(): number[] {
  const now = new Date();
  const monthly: number[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const month = d.getMonth();
    // Base + seasonality (higher in fall/winter) + growth
    const base = 14000 + (11 - i) * 400;
    const season = month >= 8 && month <= 11 ? 1.15 : month >= 2 && month <= 5 ? 0.92 : 1;
    const growth = 1 + (11 - i) * 0.02;
    monthly.push(Math.round(base * season * growth * (0.85 + Math.random() * 0.3)));
  }
  return monthly;
}

export function getDemoMerchantStats(): MerchantStats {
  const monthly = buildMonthlyRevenue();
  const currentMonthRevenue = monthly[11] ?? 20800;
  const prevMonthRevenue = monthly[10] ?? 19200;
  const trend = (v: number, prev: number) =>
    prev === 0 ? '+100%' : `${((v - prev) / prev) * 100 >= 0 ? '+' : ''}${Math.round(((v - prev) / prev) * 100)}%`;
  return {
    totalRevenue: currentMonthRevenue,
    revenueNet: Math.round(currentMonthRevenue * 0.94),
    totalCouponDiscounts: Math.round(currentMonthRevenue * 0.06),
    conversionRate: 87,
    totalBookings: 42,
    avgPerBooking: Math.round(currentMonthRevenue / 42),
    newClients: 10,
    trends: {
      totalRevenue: trend(currentMonthRevenue, prevMonthRevenue),
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
      avgSessionTime: 2.8,
      occupancy: 22,
      studios: [
        { studioId: 's1', name: 'North Tel Aviv Studio', occupancy: 28 },
        { studioId: 's2', name: 'South Recording Hub', occupancy: 19 },
        { studioId: 's3', name: 'Central Mix Room', occupancy: 20 }
      ]
    },
    topClients: [
      { id: 'c1', name: 'Yael Cohen', totalSpent: 8450, bookingsCount: 12, lastVisit: 'אתמול' },
      { id: 'c2', name: 'David Levi', totalSpent: 6200, bookingsCount: 8, lastVisit: 'לפני 3 ימים' },
      { id: 'c3', name: 'Noa Shapira', totalSpent: 5100, bookingsCount: 7, lastVisit: '15/02/2026' },
      { id: 'c4', name: 'Eitan Mizrahi', totalSpent: 3800, bookingsCount: 5, lastVisit: '10/02/2026' },
      { id: 'c5', name: 'Shira Ben-David', totalSpent: 2900, bookingsCount: 4, lastVisit: '05/02/2026' }
    ],
    revenueByPeriod: {
      monthly,
      weekly: [3200, 4100, 3800, 4500, 2900, 5200, 2100],
      daily: Array.from({ length: 24 }, (_, i) =>
        i >= 9 && i <= 20 ? Math.round(400 + Math.random() * 600) : Math.round(Math.random() * 150)
      )
    }
  };
}

export function getDemoStudioAnalytics(): { studios: StudioAnalyticsRow[] } {
  return {
    studios: [
      {
        studioId: 's1',
        studioName: 'North Tel Aviv Studio',
        revenue: 8920,
        bookingCount: 18,
        avgBookingValue: 495,
        occupancy: 28,
        topItems: [
          { itemId: 'i1', name: 'Main Live Room', bookings: 11, revenue: 5610 },
          { itemId: 'i2', name: 'Vocal Booth', bookings: 7, revenue: 3310 }
        ],
        growthTrend: '+18%',
        topCustomers: [
          { id: 'c1', name: 'Yael Cohen', totalSpent: 3200, bookingsCount: 5 },
          { id: 'c2', name: 'David Levi', totalSpent: 2100, bookingsCount: 3 }
        ]
      },
      {
        studioId: 's2',
        studioName: 'South Recording Hub',
        revenue: 6540,
        bookingCount: 14,
        avgBookingValue: 467,
        occupancy: 19,
        topItems: [
          { itemId: 'i3', name: 'Full Band Room', bookings: 9, revenue: 4320 },
          { itemId: 'i4', name: 'Podcast Booth', bookings: 5, revenue: 2220 }
        ],
        growthTrend: '+12%',
        topCustomers: [
          { id: 'c3', name: 'Noa Shapira', totalSpent: 2800, bookingsCount: 4 },
          { id: 'c1', name: 'Yael Cohen', totalSpent: 2100, bookingsCount: 3 }
        ]
      },
      {
        studioId: 's3',
        studioName: 'Central Mix Room',
        revenue: 5340,
        bookingCount: 10,
        avgBookingValue: 534,
        occupancy: 20,
        topItems: [
          { itemId: 'i5', name: 'Mixing Suite', bookings: 6, revenue: 3240 },
          { itemId: 'i6', name: 'Mastering Room', bookings: 4, revenue: 2100 }
        ],
        growthTrend: '+8%',
        topCustomers: [
          { id: 'c2', name: 'David Levi', totalSpent: 1900, bookingsCount: 3 },
          { id: 'c4', name: 'Eitan Mizrahi', totalSpent: 1500, bookingsCount: 2 }
        ]
      }
    ]
  };
}

const DEMO_CUSTOMERS: CustomerAnalyticsRow[] = [
  {
    customerId: 'c1',
    customerName: 'Yael Cohen',
    lifetimeValue: 8450,
    bookingCount: 12,
    avgSpendPerVisit: 705,
    firstVisit: '15/03/2025',
    lastVisit: '23/02/2026',
    favoriteStudio: 'North Tel Aviv Studio',
    favoriteItem: 'Main Live Room',
    visitFrequency: 1.2,
    churnRisk: 'low'
  },
  {
    customerId: 'c2',
    customerName: 'David Levi',
    lifetimeValue: 6200,
    bookingCount: 8,
    avgSpendPerVisit: 775,
    firstVisit: '22/04/2025',
    lastVisit: '20/02/2026',
    favoriteStudio: 'South Recording Hub',
    favoriteItem: 'Full Band Room',
    visitFrequency: 0.8,
    churnRisk: 'low'
  },
  {
    customerId: 'c3',
    customerName: 'Noa Shapira',
    lifetimeValue: 5100,
    bookingCount: 7,
    avgSpendPerVisit: 729,
    firstVisit: '10/05/2025',
    lastVisit: '15/02/2026',
    favoriteStudio: 'South Recording Hub',
    favoriteItem: 'Full Band Room',
    visitFrequency: 0.7,
    churnRisk: 'medium'
  },
  {
    customerId: 'c4',
    customerName: 'Eitan Mizrahi',
    lifetimeValue: 3800,
    bookingCount: 5,
    avgSpendPerVisit: 760,
    firstVisit: '18/06/2025',
    lastVisit: '10/02/2026',
    favoriteStudio: 'Central Mix Room',
    favoriteItem: 'Mixing Suite',
    visitFrequency: 0.5,
    churnRisk: 'low'
  },
  {
    customerId: 'c5',
    customerName: 'Shira Ben-David',
    lifetimeValue: 2900,
    bookingCount: 4,
    avgSpendPerVisit: 725,
    firstVisit: '01/08/2025',
    lastVisit: '05/02/2026',
    favoriteStudio: 'North Tel Aviv Studio',
    favoriteItem: 'Vocal Booth',
    visitFrequency: 0.6,
    churnRisk: 'low'
  },
  {
    customerId: 'c6',
    customerName: 'Omer Goldman',
    lifetimeValue: 2400,
    bookingCount: 3,
    avgSpendPerVisit: 800,
    firstVisit: '12/09/2025',
    lastVisit: '28/01/2026',
    favoriteStudio: 'Central Mix Room',
    favoriteItem: 'Mastering Room',
    visitFrequency: 0.5,
    churnRisk: 'medium'
  },
  {
    customerId: 'c7',
    customerName: 'Tamar Rosen',
    lifetimeValue: 1850,
    bookingCount: 3,
    avgSpendPerVisit: 617,
    firstVisit: '20/10/2025',
    lastVisit: '15/01/2026',
    favoriteStudio: 'South Recording Hub',
    favoriteItem: 'Podcast Booth',
    visitFrequency: 0.4,
    churnRisk: 'high'
  },
  {
    customerId: 'c8',
    customerName: 'Ido Katz',
    lifetimeValue: 1200,
    bookingCount: 2,
    avgSpendPerVisit: 600,
    firstVisit: '05/11/2025',
    lastVisit: '02/12/2025',
    favoriteStudio: 'North Tel Aviv Studio',
    favoriteItem: 'Main Live Room',
    visitFrequency: 0.2,
    churnRisk: 'high'
  }
];

export function getDemoCustomerAnalytics(params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
}): {
  customers: CustomerAnalyticsRow[];
  total: number;
  page: number;
  limit: number;
  pages: number;
} {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const search = (params?.search ?? '').trim().toLowerCase();
  let list = [...DEMO_CUSTOMERS];
  if (search) {
    list = list.filter((c) => c.customerName.toLowerCase().includes(search));
  }
  const sortBy = params?.sortBy ?? 'totalSpent';
  if (sortBy === 'lastVisit') {
    list.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
  } else if (sortBy === 'bookings') {
    list.sort((a, b) => b.bookingCount - a.bookingCount);
  } else {
    list.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }
  const total = list.length;
  const start = (page - 1) * limit;
  const customers = list.slice(start, start + limit);
  return {
    customers,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1
  };
}

export function getDemoCustomerDetail(customerId: string): CustomerDetailResponse {
  const c = DEMO_CUSTOMERS.find((x) => x.customerId === customerId) ?? DEMO_CUSTOMERS[0];
  const monthly = buildMonthlyRevenue();
  return {
    customerId: c.customerId,
    bookingHistory: [
      { id: 'r1', date: '23/02/2026', studioName: 'North Tel Aviv Studio', itemName: 'Main Live Room', price: 540, status: 'confirmed' },
      { id: 'r2', date: '15/02/2026', studioName: 'South Recording Hub', itemName: 'Full Band Room', price: 720, status: 'confirmed' },
      { id: 'r3', date: '08/02/2026', studioName: 'North Tel Aviv Studio', itemName: 'Vocal Booth', price: 360, status: 'confirmed' },
      { id: 'r4', date: '28/01/2026', studioName: 'Central Mix Room', itemName: 'Mixing Suite', price: 540, status: 'confirmed' },
      { id: 'r5', date: '12/01/2026', studioName: 'South Recording Hub', itemName: 'Podcast Booth', price: 444, status: 'confirmed' }
    ],
    spendingTrend: monthly.map((m, i) => (i >= 9 ? Math.round(m * 0.08) : 0)),
    preferredTimeSlots: ['10:00', '14:00', '16:00'],
    preferredDays: ['Wednesday', 'Thursday', 'Sunday']
  };
}

export function getDemoProjections(): ProjectionsResponse {
  const monthly = buildMonthlyRevenue();
  const lastThree = monthly.slice(-3);
  const avg = lastThree.reduce((a, b) => a + b, 0) / 3;
  return {
    confirmedUpcoming: 4200,
    projectedMonthly: [Math.round(avg), Math.round(avg * 1.02), Math.round(avg * 1.04)],
    monthlyActuals: monthly,
    projectedLine: [Math.round(avg), Math.round(avg * 1.02), Math.round(avg * 1.04)],
    confidence: 'high'
  };
}

export function getDemoRevenueBreakdown(): RevenueBreakdownResponse {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    byStudio: [
      { name: 'North Tel Aviv Studio', revenue: 8920, percentage: 42.8 },
      { name: 'South Recording Hub', revenue: 6540, percentage: 31.4 },
      { name: 'Central Mix Room', revenue: 5340, percentage: 25.8 }
    ],
    byItem: [
      { name: 'Main Live Room', studioName: 'North Tel Aviv Studio', revenue: 5610, bookings: 11, percentage: 26.9 },
      { name: 'Full Band Room', studioName: 'South Recording Hub', revenue: 4320, bookings: 9, percentage: 20.8 },
      { name: 'Mixing Suite', studioName: 'Central Mix Room', revenue: 3240, bookings: 6, percentage: 15.6 },
      { name: 'Vocal Booth', studioName: 'North Tel Aviv Studio', revenue: 3310, bookings: 7, percentage: 15.9 },
      { name: 'Podcast Booth', studioName: 'South Recording Hub', revenue: 2220, bookings: 5, percentage: 10.7 },
      { name: 'Mastering Room', studioName: 'Central Mix Room', revenue: 2100, bookings: 4, percentage: 10.1 }
    ],
    byDayOfWeek: dayNames.map((day, dayIndex) => ({
      day,
      dayIndex,
      revenue: dayIndex >= 0 && dayIndex <= 4 ? 2800 + dayIndex * 200 : 1200 + (dayIndex - 5) * 400,
      bookings: dayIndex >= 0 && dayIndex <= 4 ? 8 + dayIndex : 3
    })),
    byTimeOfDay: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      revenue: hour >= 9 && hour <= 20 ? 400 + (hour - 9) * 80 : 50,
      bookings: hour >= 9 && hour <= 20 ? 2 : 0
    })),
    couponImpact: {
      totalDiscounts: 1248,
      avgDiscountPercent: 18,
      bookingsWithCoupon: 9,
      bookingsWithoutCoupon: 33
    }
  };
}

export function getDemoCancellationStats(): CancellationStats {
  return {
    totalCancelled: 6,
    cancellationRate: 12.5,
    cancelledRevenue: 2840,
    topCancellationReasons: [
      { reason: 'Schedule conflict', count: 3 },
      { reason: 'Other', count: 2 },
      { reason: 'Found alternative', count: 1 }
    ],
    cancellationsByDay: [0, 1, 0, 2, 1, 1, 1],
    trend: '-15%',
    isPositive: true
  };
}

export function getDemoPopularTimeSlots(): PopularTimeSlotsResponse {
  const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    timeSlots: slots.map((slot, i) => ({
      slot,
      bookings: 2 + (i >= 2 && i <= 7 ? 3 : 1),
      revenue: (2 + (i >= 2 && i <= 7 ? 3 : 1)) * 450,
      percentage: 8 + Math.floor(Math.random() * 6)
    })),
    byDay: dayNames.map((day, i) => ({
      day,
      dayIndex: i,
      bookings: i >= 1 && i <= 4 ? 8 : 4,
      revenue: i >= 1 && i <= 4 ? 3600 : 1800,
      percentage: i >= 1 && i <= 4 ? 12 : 6
    }))
  };
}

export function getDemoRepeatCustomerStats(): RepeatCustomerStats {
  return {
    totalCustomers: 24,
    repeatCustomers: 14,
    repeatRate: 58.3,
    avgBookingsPerRepeat: 4.2,
    repeatCustomerRevenue: 31200,
    revenuePercentage: 78,
    topRepeatCustomers: [
      { id: 'c1', name: 'Yael Cohen', bookings: 12, totalSpent: 8450, lastVisit: 'אתמול' },
      { id: 'c2', name: 'David Levi', bookings: 8, totalSpent: 6200, lastVisit: 'לפני 3 ימים' },
      { id: 'c3', name: 'Noa Shapira', bookings: 7, totalSpent: 5100, lastVisit: '15/02/2026' }
    ]
  };
}
