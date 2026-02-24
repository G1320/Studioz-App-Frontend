import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MoneyIcon,
  BarChartIcon,
  TrendingUpIcon,
  PeopleOutlineIcon,
  CalendarIcon
} from '@shared/components/icons';
import { useMerchantStats, useProjections } from '@shared/hooks';
import { StatCard } from './StatCard';
import { RevenueChart, type ChartPeriod } from './RevenueChart';
import { ClientRow } from './ClientRow';
import { QuickStats } from './QuickStats';
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
  const navigate = useNavigate();
  const [period, setPeriod] = useState<ChartPeriod>('monthly');

  const { data: stats, isLoading } = useMerchantStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });
  const { data: projections } = useProjections();

  const chartData = useMemo(() => {
    if (!stats?.revenueByPeriod) return undefined;
    return stats.revenueByPeriod[period];
  }, [stats?.revenueByPeriod, period]);

  const projectedMonthly = projections?.projectedMonthly?.[0] ?? 0;

  const handleViewAllClients = useCallback(() => {
    navigate('/dashboard/reservations');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--overview">
        <div className="merchant-stats__loader">{t('loading', 'טוען נתונים...')}</div>
      </div>
    );
  }

  return (
    <div className="merchant-stats__section merchant-stats__section--overview">
      <div className="merchant-stats__metrics">
        <StatCard
          title={t('metrics.totalRevenue', 'סה״כ הכנסות')}
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          trend={stats?.trends?.totalRevenue ?? '0%'}
          isPositive={stats?.isPositive?.totalRevenue ?? true}
          icon={<MoneyIcon />}
        />
        <StatCard
          title={t('metrics.totalBookings', 'סה״כ הזמנות')}
          value={String(stats?.totalBookings ?? 0)}
          trend={stats?.trends?.totalBookings ?? '0%'}
          isPositive={stats?.isPositive?.totalBookings ?? true}
          icon={<BarChartIcon />}
        />
        <StatCard
          title={t('metrics.avgPerBooking', 'ממוצע להזמנה')}
          value={`₪${stats?.avgPerBooking ?? 0}`}
          trend={stats?.trends?.avgPerBooking ?? '0%'}
          isPositive={stats?.isPositive?.avgPerBooking ?? true}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          title={t('metrics.newClients', 'לקוחות חדשים')}
          value={String(stats?.newClients ?? 0)}
          trend={stats?.trends?.newClients ?? '0%'}
          isPositive={stats?.isPositive?.newClients ?? true}
          icon={<PeopleOutlineIcon />}
        />
        <StatCard
          title={t('metrics.projectedMonthly', 'תחזית חודש')}
          value={formatCurrency(projectedMonthly)}
          trend="—"
          isPositive={true}
          icon={<CalendarIcon />}
        />
      </div>

      <div className="merchant-stats__content">
        <div className="merchant-stats__main">
          <RevenueChart period={period} onPeriodChange={setPeriod} data={chartData} />
          <QuickStats
            avgSessionTime={stats?.quickStats?.avgSessionTime ?? 0}
            occupancy={stats?.quickStats?.occupancy ?? 0}
            studios={stats?.quickStats?.studios ?? []}
          />
        </div>

        <div className="merchant-stats__sidebar">
          <div className="clients-card">
            <div className="clients-card__header">
              <h2>{t('clients.title', 'לקוחות מובילים')}</h2>
              <button type="button" className="view-all" onClick={handleViewAllClients}>
                {t('clients.viewAll', 'הצג הכל')}
              </button>
            </div>
            <div className="clients-list">
              {(stats?.topClients ?? []).map((client) => (
                <ClientRow
                  key={client.id}
                  name={client.name}
                  role={`${client.bookingsCount} ${t('clients.bookings', 'הזמנות')}`}
                  totalSpent={client.totalSpent}
                  lastVisit={client.lastVisit}
                  avatarUrl={client.avatarUrl}
                  onClick={() => onClientClick?.(client.id)}
                />
              ))}
              {(!stats?.topClients || stats.topClients.length === 0) && (
                <div className="clients-list__empty">{t('clients.noClients', 'אין לקוחות עדיין')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
