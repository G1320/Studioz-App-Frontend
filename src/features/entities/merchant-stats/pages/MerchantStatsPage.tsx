import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  MoneyIcon,
  BarChartIcon,
  TrendingUpIcon,
  PeopleOutlineIcon,
  FilterIcon
} from '@shared/components/icons';

import { useUserContext } from '@core/contexts';
import { useStudios, useMerchantStats } from '@shared/hooks';
import {
  StatCard,
  RevenueChart,
  ClientRow,
  QuickStats,
  DateRangePicker,
  ExportDropdown,
  type ChartPeriod,
  type DateRange
} from '../components';
import '../styles/_merchant-stats.scss';

const MerchantStatsPage: React.FC = () => {
  const { t, i18n } = useTranslation('merchantStats');
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();

  const [period, setPeriod] = useState<ChartPeriod>('monthly');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate(),
    label: t('dateRange.thisMonth', 'החודש הנוכחי')
  });

  // Pass date range to hook - it will auto-refetch when dates change
  const { data: stats, isLoading, isDemo } = useMerchantStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  // Helper to extract localized string from multilingual object
  const getLocalizedName = useCallback((name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  }, [i18n.language]);

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    if (amount >= 1000) {
      return `₪${(amount / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return `₪${amount.toLocaleString()}`;
  }, []);

  // Get studio name for greeting
  const studioName = getLocalizedName(userStudios[0]?.name) || t('header.defaultStudio', 'האולפן שלך');

  // Get chart data based on period
  const chartData = useMemo(() => {
    if (!stats?.revenueByPeriod) return undefined;
    return stats.revenueByPeriod[period];
  }, [stats?.revenueByPeriod, period]);

  // Handle date range change - hook auto-refetches when dateRange state changes
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  // Handle period change
  const handlePeriodChange = useCallback((newPeriod: ChartPeriod) => {
    setPeriod(newPeriod);
  }, []);

  // Handle view all clients
  const handleViewAllClients = useCallback(() => {
    navigate('/dashboard/reservations');
  }, [navigate]);

  // Handle client row click
  const handleClientClick = useCallback((clientId: string) => {
    // Could navigate to client detail page in future
    console.log('Client clicked:', clientId);
  }, []);

  // Prepare export data
  const exportData = useMemo(() => ({
    totalRevenue: stats?.totalRevenue || 0,
    totalBookings: stats?.totalBookings || 0,
    avgPerBooking: stats?.avgPerBooking || 0,
    newClients: stats?.newClients || 0,
    topClients: stats?.topClients || [],
    revenueByPeriod: stats?.revenueByPeriod || { monthly: [], weekly: [], daily: [] },
    dateRange
  }), [stats, dateRange]);

  if (isLoading) {
    return (
      <div className="merchant-stats merchant-stats--loading">
        <div className="merchant-stats__loader">טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="merchant-stats">
      {/* Demo mode indicator */}
      {isDemo && (
        <div className="merchant-stats__demo-banner">
          <span>{t('demo.notice', 'מציג נתוני הדגמה - הנתונים האמיתיים יופיעו כאשר יהיו הזמנות')}</span>
        </div>
      )}

      {/* Header */}
      <header className="merchant-stats__header">
        <div className="merchant-stats__greeting">
          <h1>
            {t('header.greeting', 'שלום,')} <span className="highlight">{studioName}</span>
          </h1>
          <p>{t('header.subtitle', 'הנה סקירה של הביצועים שלך לתקופה זו')}</p>
        </div>

        <div className="merchant-stats__controls">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />

          <ExportDropdown
            data={exportData}
            studioName={studioName}
          />
        </div>
      </header>

      {/* Key Metrics */}
      <div className="merchant-stats__metrics">
        <StatCard
          title={t('metrics.totalRevenue', 'סה״כ הכנסות')}
          value={formatCurrency(stats?.totalRevenue || 0)}
          trend={stats?.trends?.totalRevenue || '0%'}
          isPositive={stats?.isPositive?.totalRevenue ?? true}
          icon={<MoneyIcon />}
        />
        <StatCard
          title={t('metrics.totalBookings', 'סה״כ הזמנות')}
          value={String(stats?.totalBookings || 0)}
          trend={stats?.trends?.totalBookings || '0%'}
          isPositive={stats?.isPositive?.totalBookings ?? true}
          icon={<BarChartIcon />}
        />
        <StatCard
          title={t('metrics.avgPerBooking', 'ממוצע להזמנה')}
          value={`₪${stats?.avgPerBooking || 0}`}
          trend={stats?.trends?.avgPerBooking || '0%'}
          isPositive={stats?.isPositive?.avgPerBooking ?? true}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          title={t('metrics.newClients', 'לקוחות חדשים')}
          value={String(stats?.newClients || 0)}
          trend={stats?.trends?.newClients || '0%'}
          isPositive={stats?.isPositive?.newClients ?? true}
          icon={<PeopleOutlineIcon />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="merchant-stats__content">
        {/* Left Column - Charts */}
        <div className="merchant-stats__main">
          {/* Revenue Chart */}
          <RevenueChart
            period={period}
            onPeriodChange={handlePeriodChange}
            data={chartData}
          />

          {/* Quick Stats Row */}
          <QuickStats
            avgSessionTime={stats?.quickStats?.avgSessionTime || 0}
            occupancy={stats?.quickStats?.occupancy || 0}
            studios={stats?.quickStats?.studios || []}
          />
        </div>

        {/* Right Column - Clients */}
        <div className="merchant-stats__sidebar">
          <div className="clients-card">
            <div className="clients-card__header">
              <h2>{t('clients.title', 'לקוחות מובילים')}</h2>
              <button
                className="view-all"
                onClick={handleViewAllClients}
              >
                {t('clients.viewAll', 'הצג הכל')}
              </button>
            </div>

            <div className="clients-list">
              {(stats?.topClients || []).map((client) => (
                <ClientRow
                  key={client.id}
                  name={client.name}
                  role={`${client.bookingsCount} ${t('clients.bookings', 'הזמנות')}`}
                  totalSpent={client.totalSpent}
                  lastVisit={client.lastVisit}
                  avatarUrl={client.avatarUrl}
                  onClick={() => handleClientClick(client.id)}
                />
              ))}
              {(!stats?.topClients || stats.topClients.length === 0) && (
                <div className="clients-list__empty">
                  {t('clients.noClients', 'אין לקוחות עדיין')}
                </div>
              )}
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
