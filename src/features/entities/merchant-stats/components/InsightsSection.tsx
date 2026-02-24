import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useRevenueBreakdown, useCancellationStats, usePopularTimeSlots } from '@shared/hooks';
import type { DateRange } from './DateRangePicker';

interface InsightsSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

const DAY_KEYS = ['days.sun', 'days.mon', 'days.tue', 'days.wed', 'days.thu', 'days.fri', 'days.sat'];

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  dateRange,
  formatCurrency
}) => {
  const { t } = useTranslation('merchantStats');

  const { data: breakdown, isLoading: breakdownLoading } = useRevenueBreakdown({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });
  const { data: cancellation, isLoading: cancelLoading } = useCancellationStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });
  const { isLoading: slotsLoading } = usePopularTimeSlots({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const isLoading = breakdownLoading || cancelLoading || slotsLoading;

  const byDayData = useMemo(() => {
    const byDay = breakdown?.byDayOfWeek ?? [];
    return byDay.map((d, i) => ({
      name: t(DAY_KEYS[i] ?? `days.${i}`, d.day),
      revenue: d.revenue,
      bookings: d.bookings
    }));
  }, [breakdown?.byDayOfWeek, t]);

  const cancellationsByDayData = useMemo(() => {
    const byDay = cancellation?.cancellationsByDay ?? Array(7).fill(0);
    return byDay.map((count: number, i: number) => ({
      name: t(DAY_KEYS[i], ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'][i]),
      count
    }));
  }, [cancellation?.cancellationsByDay, t]);

  const heatmapData = useMemo(() => {
    const byTime = breakdown?.byTimeOfDay ?? Array.from({ length: 24 }, (_, h) => ({ hour: h, revenue: 0, bookings: 0 }));
    const maxRev = Math.max(...byTime.map((x) => x.revenue), 1);
    return byTime.map((x) => ({
      hour: x.hour,
      revenue: x.revenue,
      intensity: maxRev > 0 ? x.revenue / maxRev : 0
    }));
  }, [breakdown?.byTimeOfDay]);

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--insights">
        <div className="merchant-stats__loader">{t('loading', 'טוען נתונים...')}</div>
      </div>
    );
  }

  const couponImpact = breakdown?.couponImpact ?? {
    totalDiscounts: 0,
    avgDiscountPercent: 0,
    bookingsWithCoupon: 0,
    bookingsWithoutCoupon: 0
  };

  return (
    <div className="merchant-stats__section merchant-stats__section--insights">
      <div className="insights-cards">
        <div className="insight-card">
          <h4>{t('insights.cancellationRate', 'שיעור ביטולים')}</h4>
          <p className="insight-card__value">{cancellation?.cancellationRate ?? 0}%</p>
          <p className="insight-card__sub">{t('insights.trend', 'מגמה')}: {cancellation?.trend ?? '0%'}</p>
        </div>
        <div className="insight-card">
          <h4>{t('insights.couponImpact', 'השפעת קופונים')}</h4>
          <p className="insight-card__value">{formatCurrency(couponImpact.totalDiscounts)}</p>
          <p className="insight-card__sub">
            {couponImpact.bookingsWithCoupon} {t('insights.bookingsWithCoupon', 'הזמנות עם קופון')} · {couponImpact.avgDiscountPercent}% {t('insights.avgDiscount', 'ממוצע הנחה')}
          </p>
        </div>
      </div>

      <div className="insights-heatmap">
        <h3>{t('insights.heatmapTitle', 'הכנסות לפי שעה')}</h3>
        <div className="heatmap-grid">
          {heatmapData.map((cell) => (
            <div
              key={cell.hour}
              className="heatmap-cell"
              style={{
                backgroundColor: `var(--color-brand)`,
                opacity: 0.1 + cell.intensity * 0.9
              }}
              title={`${cell.hour}:00 - ${formatCurrency(cell.revenue)}`}
            >
              <span className="heatmap-cell__label">{cell.hour}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-charts-row">
        <div className="insights-day-chart">
          <h4>{t('insights.revenueByDay', 'הכנסות לפי יום')}</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byDayData} margin={{ top: 10, right: 10, left: 36, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                width={32}
                tickMargin={10}
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                tickFormatter={(v) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '8px'
                }}
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0), t('revenueChart.revenue', 'הכנסה')]}
              />
              <Bar dataKey="revenue" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="insights-cancellations">
          <h4>{t('insights.cancellationsByDay', 'ביטולים לפי יום')}</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cancellationsByDayData} margin={{ top: 10, right: 10, left: 36, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                width={32}
                tickMargin={10}
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '8px'
                }}
                formatter={(value: number | undefined) => [value ?? 0, t('insights.cancellations', 'ביטולים')]}
              />
              <Bar dataKey="count" fill="var(--text-muted)" radius={[4, 4, 0, 0]} name={t('insights.cancellations', 'ביטולים')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
