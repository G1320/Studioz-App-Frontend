import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  MoneyIcon,
  BarChartIcon,
  TrendingUpIcon,
  PeopleOutlineIcon,
  CalendarTodayIcon,
  ChevronDownIcon,
  DownloadIcon,
  FilterIcon
} from '@shared/components/icons';

import { useUserContext } from '@core/contexts';
import { useStudios, useReservations } from '@shared/hooks';
import { StatCard, RevenueChart, ClientRow, QuickStats, type ChartPeriod } from '../components';
import '../styles/_merchant-stats.scss';

// Mock client data (in production, this would come from an API)
const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'רונן דהן',
    role: 'מפיק מוזיקלי',
    totalSpent: 12450,
    lastVisit: 'אתמול',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'שרי גולן',
    role: 'זמרת יוצרת',
    totalSpent: 8320,
    lastVisit: 'לפני יומיים',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'להקת \'השכנים\'',
    role: 'הרכב רוק',
    totalSpent: 5600,
    lastVisit: '04/01/2024'
  },
  {
    id: '4',
    name: 'גיא מרגלית',
    role: 'פודקאסטר',
    totalSpent: 4100,
    lastVisit: '01/01/2024',
    avatarUrl: 'https://randomuser.me/api/portraits/men/86.jpg'
  },
  {
    id: '5',
    name: 'נועה קירל',
    role: 'אמנית',
    totalSpent: 3200,
    lastVisit: '28/12/2023',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const MerchantStatsPage: React.FC = () => {
  const { t, i18n } = useTranslation('merchantStats');
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();
  const { data: reservations = [] } = useReservations();
  
  const [period, setPeriod] = useState<ChartPeriod>('monthly');
  
  // Helper to extract localized string from multilingual object
  const getLocalizedName = (name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  };

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Calculate stats from reservations
  const stats = useMemo(() => {
    const currentMonthStart = dayjs().startOf('month');
    const prevMonthStart = dayjs().subtract(1, 'month').startOf('month');
    const prevMonthEnd = dayjs().subtract(1, 'month').endOf('month');

    const getTimestamp = (res: any) => {
      if (res.createdAt) return dayjs(res.createdAt).valueOf();
      return dayjs(res.bookingDate, 'DD/MM/YYYY').valueOf();
    };

    // Filter all studio reservations
    const allStudioReservations = reservations.filter((res) =>
      userStudios.some((studio) =>
        studio.items.some((item) => item.itemId === res.itemId)
      )
    );

    // Filter by month
    const thisMonthReservations = allStudioReservations.filter((res) => {
      const ts = getTimestamp(res);
      return ts >= currentMonthStart.valueOf();
    });

    const lastMonthReservations = allStudioReservations.filter((res) => {
      const ts = getTimestamp(res);
      return ts >= prevMonthStart.valueOf() && ts <= prevMonthEnd.valueOf();
    });

    // Helper to calculate metrics for a set of reservations
    const calculateMetrics = (resList: typeof reservations) => {
      const totalRevenue = resList.reduce(
        (sum, res) => sum + (res.totalPrice || 0),
        0
      );

      // Filter for confirmed bookings only for average calculation to be accurate
      const confirmedReservations = resList.filter(res => res.status === 'confirmed');
      const confirmedRevenue = confirmedReservations.reduce(
        (sum, res) => sum + (res.totalPrice || 0),
        0
      );

      const confirmedBookingsCount = confirmedReservations.length;

      const avgPerBooking = confirmedBookingsCount > 0
        ? Math.round(confirmedRevenue / confirmedBookingsCount)
        : 0;

      const uniqueCustomers = new Set(
        resList.map((res) => res.customerId || res.userId)
      ).size;

      return { totalRevenue, totalBookings: resList.length, avgPerBooking, newClients: uniqueCustomers };
    };

    const currentMetrics = calculateMetrics(thisMonthReservations);
    const prevMetrics = calculateMetrics(lastMonthReservations);

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const diff = ((current - previous) / previous) * 100;
      return `${diff > 0 ? '+' : ''}${Math.round(diff)}%`;
    };

    const trends = {
      totalRevenue: calculateTrend(currentMetrics.totalRevenue, prevMetrics.totalRevenue),
      totalBookings: calculateTrend(currentMetrics.totalBookings, prevMetrics.totalBookings),
      avgPerBooking: calculateTrend(currentMetrics.avgPerBooking, prevMetrics.avgPerBooking),
      newClients: calculateTrend(currentMetrics.newClients, prevMetrics.newClients)
    };

    // Determine if trends are positive (for coloring)
    const isPositive = {
      totalRevenue: currentMetrics.totalRevenue >= prevMetrics.totalRevenue,
      totalBookings: currentMetrics.totalBookings >= prevMetrics.totalBookings,
      avgPerBooking: currentMetrics.avgPerBooking >= prevMetrics.avgPerBooking,
      newClients: currentMetrics.newClients >= prevMetrics.newClients
    };

    // Calculate quick stats (Average Session Time & Occupancy)
    // Note: useMemo inside useMemo is not allowed, so logic is flattened here
    
    // Average session duration
    const totalDuration = thisMonthReservations.reduce((acc, res) => {
      return acc + (res.timeSlots?.length || 0);
    }, 0);
    
    const avgSessionTime = thisMonthReservations.length > 0 
      ? Math.round((totalDuration / thisMonthReservations.length) * 10) / 10 
      : 0;

    // Studio Occupancy (Simplified calculation)
    // Assuming 12 hours operational day * 30 days * number of studios
    const operationalHoursPerMonth = 12 * 30;
    const totalCapacity = userStudios.length * operationalHoursPerMonth;
    
    const occupancy = totalCapacity > 0 
      ? Math.round((totalDuration / totalCapacity) * 100) 
      : 0;
    
    // Calculate per-studio occupancy (Room A / Room B etc)
    // We take top 2 studios if available
    const studioOccupancy = userStudios.slice(0, 2).map(studio => {
      const studioRes = thisMonthReservations.filter(r => 
        studio.items.some(item => item.itemId === r.itemId)
      );
      const studioDuration = studioRes.reduce((acc, r) => acc + (r.timeSlots?.length || 0), 0);
      const studioCapacity = operationalHoursPerMonth; // Per studio capacity
      
      return {
        name: getLocalizedName(studio.name),
        occupancy: studioCapacity > 0 ? Math.round((studioDuration / studioCapacity) * 100) : 0
      };
    });

    const quickStats = {
      avgSessionTime,
      occupancy,
      studios: studioOccupancy
    };

    return {
      ...currentMetrics,
      trends,
      isPositive,
      quickStats
    };
  }, [reservations, userStudios]);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `₪${(amount / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return `₪${amount.toLocaleString()}`;
  };

  // Get studio name for greeting
  const studioName = getLocalizedName(userStudios[0]?.name) || t('header.defaultStudio', 'האולפן שלך');

  return (
    <div className="merchant-stats">
      {/* Header */}
      <header className="merchant-stats__header">
        <div className="merchant-stats__greeting">
          <h1>
            {t('header.greeting', 'שלום,')} <span className="highlight">{studioName}</span>
          </h1>
          <p>{t('header.subtitle', 'הנה סקירה של הביצועים שלך לתקופה זו')}</p>
        </div>

        <div className="merchant-stats__controls">
          <button className="merchant-stats__date-picker">
            <CalendarTodayIcon className="icon-calendar" />
            <span>{dayjs().format('MMMM YYYY')}</span>
            <ChevronDownIcon className="icon-chevron" />
          </button>

          <button className="merchant-stats__export-btn" title={t('header.export', 'ייצוא')}>
            <DownloadIcon />
          </button>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="merchant-stats__metrics">
        <StatCard
          title={t('metrics.totalRevenue', 'סה״כ הכנסות')}
          value={formatCurrency(stats.totalRevenue)}
          trend={stats.trends.totalRevenue}
          isPositive={stats.isPositive.totalRevenue}
          icon={<MoneyIcon />}
        />
        <StatCard
          title={t('metrics.totalBookings', 'סה״כ הזמנות')}
          value={String(stats.totalBookings)}
          trend={stats.trends.totalBookings}
          isPositive={stats.isPositive.totalBookings}
          icon={<BarChartIcon />}
        />
        <StatCard
          title={t('metrics.avgPerBooking', 'ממוצע להזמנה')}
          value={`₪${stats.avgPerBooking}`}
          trend={stats.trends.avgPerBooking}
          isPositive={stats.isPositive.avgPerBooking}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          title={t('metrics.newClients', 'לקוחות חדשים')}
          value={String(stats.newClients)}
          trend={stats.trends.newClients}
          isPositive={stats.isPositive.newClients}
          icon={<PeopleOutlineIcon />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="merchant-stats__content">
        {/* Left Column - Charts */}
        <div className="merchant-stats__main">
          {/* Revenue Chart */}
          <RevenueChart period={period} onPeriodChange={setPeriod} />

          {/* Quick Stats Row */}
          <QuickStats 
            avgSessionTime={stats.quickStats.avgSessionTime}
            occupancy={stats.quickStats.occupancy}
            studios={stats.quickStats.studios}
          />
        </div>

        {/* Right Column - Clients */}
        <div className="merchant-stats__sidebar">
          <div className="clients-card">
            <div className="clients-card__header">
              <h2>{t('clients.title', 'לקוחות מובילים')}</h2>
              <button className="view-all">
                {t('clients.viewAll', 'הצג הכל')}
              </button>
            </div>

            <div className="clients-list">
              {MOCK_CLIENTS.map((client) => (
                <ClientRow
                  key={client.id}
                  name={client.name}
                  role={client.role}
                  totalSpent={client.totalSpent}
                  lastVisit={client.lastVisit}
                  avatarUrl={client.avatarUrl}
                />
              ))}
            </div>

            <button className="clients-card__filter-btn" style={{ display: 'none' }}>
              <FilterIcon />
              {t('clients.filterByCategory', 'סנן לפי קטגוריה')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantStatsPage;
