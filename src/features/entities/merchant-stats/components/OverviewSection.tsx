import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMerchantStats, useProjections, useCancellationStats } from '@shared/hooks';
import { StatCard } from './StatCard';
import { RevenueChart, type ChartPeriod } from './RevenueChart';
import { ClientRow } from './ClientRow';
import { QuickStats } from './QuickStats';
import { StatCardSkeleton, ChartSkeleton } from './SkeletonLoader';
import type { DateRange } from './DateRangePicker';

interface OverviewSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
  onClientClick?: (clientId: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  dateRange,
  formatCurrency,
  onClientClick
}) => {
  const { t } = useTranslation('merchantStats');
  const [period, setPeriod] = useState<ChartPeriod>('monthly');

  const statsParams = useMemo(
    () => ({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }),
    [dateRange.startDate, dateRange.endDate]
  );

  const { data: stats, isLoading } = useMerchantStats(statsParams);
  const { data: projections } = useProjections();
  const { data: cancellations } = useCancellationStats(statsParams);

  const chartData = useMemo(() => {
    if (!stats?.revenueByPeriod) return undefined;
    return stats.revenueByPeriod[period];
  }, [stats?.revenueByPeriod, period]);

  const projectedMonthly = projections?.projectedMonthly?.[0] ?? 0;
  const confirmedUpcoming = projections?.confirmedUpcoming ?? 0;
  const topClients = stats?.topClients ?? [];
  const grossRevenue = stats?.totalRevenue ?? 0;
  const netRevenue = stats?.revenueNet ?? grossRevenue;
  const conversionRate = stats?.conversionRate;
  const cancellationRate = cancellations?.cancellationRate ?? 0;

  const openCustomers = useCallback(() => {
    onClientClick?.('__all__');
  }, [onClientClick]);

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--overview">
        <div className="merchant-stats__top">
          <div className="merchant-stats__top-metrics">
            <div className="merchant-stats__metrics merchant-stats__metrics--dense">
              {Array.from({ length: 8 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="quick-stats quick-stats--side">
            <StatCardSkeleton />
          </div>
        </div>
        <div className="merchant-stats__content">
          <div className="merchant-stats__main">
            <ChartSkeleton />
          </div>
          <div className="merchant-stats__sidebar">
            <div className="clients-card clients-card--skeleton">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-stats__section merchant-stats__section--overview">
      <div className="merchant-stats__top">
        <div className="merchant-stats__top-metrics">
          <div className="merchant-stats__metrics merchant-stats__metrics--dense">
            <StatCard
              title={t('metrics.totalRevenue', 'Total Revenue')}
              value={formatCurrency(grossRevenue)}
              trend={stats?.trends?.totalRevenue ?? '0%'}
              isPositive={stats?.isPositive?.totalRevenue ?? true}
              hint={t('metrics.totalRevenueHint', 'Gross before fees')}
            />
            <StatCard
              title={t('metrics.revenueNet', 'Net Revenue')}
              value={formatCurrency(netRevenue)}
              trend="—"
              isPositive
              showTrend={false}
              hint={t('metrics.revenueNetHint', 'After platform fees')}
              variant="secondary"
            />
            <StatCard
              title={t('metrics.totalBookings', 'Total Bookings')}
              value={String(stats?.totalBookings ?? 0)}
              trend={stats?.trends?.totalBookings ?? '0%'}
              isPositive={stats?.isPositive?.totalBookings ?? true}
              hint={t('metrics.totalBookingsHint', 'In selected period')}
            />
            <StatCard
              title={t('metrics.avgPerBooking', 'Avg per Booking')}
              value={formatCurrency(stats?.avgPerBooking ?? 0)}
              trend={stats?.trends?.avgPerBooking ?? '0%'}
              isPositive={stats?.isPositive?.avgPerBooking ?? true}
              hint={t('metrics.avgPerBookingHint', 'Gross revenue ÷ bookings')}
            />
            <StatCard
              title={t('metrics.newClients', 'New Clients')}
              value={String(stats?.newClients ?? 0)}
              trend={stats?.trends?.newClients ?? '0%'}
              isPositive={stats?.isPositive?.newClients ?? true}
              hint={t('metrics.newClientsHint', 'First-time bookers')}
            />
            <StatCard
              title={t('metrics.conversionRate', 'Conversion')}
              value={conversionRate != null ? `${conversionRate}%` : '—'}
              trend="—"
              isPositive
              showTrend={false}
              hint={t('metrics.conversionRateHint', 'Inquiries that booked')}
              variant="secondary"
            />
            <StatCard
              title={t('metrics.cancellationRate', 'Cancellations')}
              value={`${cancellationRate}%`}
              trend={cancellations?.trend ?? '—'}
              isPositive={cancellations?.isPositive ?? true}
              hint={t('metrics.cancellationRateHint', 'Of bookings in period')}
            />
            <StatCard
              title={t('metrics.projectedMonthly', 'Projected (Month)')}
              value={formatCurrency(projectedMonthly)}
              trend="—"
              isPositive
              showTrend={false}
              hint={t('metrics.projectedMonthlyHint', 'Confirmed bookings + trend')}
              variant="secondary"
            />
          </div>
        </div>

        <QuickStats
          avgSessionTime={stats?.quickStats?.avgSessionTime ?? 0}
          occupancy={stats?.quickStats?.occupancy ?? 0}
          studios={stats?.quickStats?.studios ?? []}
          confirmedUpcoming={confirmedUpcoming}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="merchant-stats__content">
        <div className="merchant-stats__main">
          <RevenueChart period={period} onPeriodChange={setPeriod} data={chartData} />
        </div>

        <aside className="merchant-stats__sidebar">
          <div className="clients-card">
            <div className="clients-card__header">
              <h2>{t('clients.title', 'Top Clients')}</h2>
              <button type="button" className="view-all" onClick={openCustomers}>
                {t('clients.viewAll', 'View All')}
              </button>
            </div>
            <div className="clients-list">
              {topClients.map((client) => (
                <ClientRow
                  key={client.id}
                  name={client.name}
                  role={`${client.bookingsCount} ${t('clients.bookings', 'bookings')}`}
                  totalSpent={client.totalSpent}
                  lastVisit={client.lastVisit}
                  avatarUrl={client.avatarUrl}
                  onClick={() => onClientClick?.(client.id)}
                />
              ))}
              {topClients.length === 0 && (
                <div className="clients-list__empty">{t('clients.noClients', 'No clients yet')}</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
