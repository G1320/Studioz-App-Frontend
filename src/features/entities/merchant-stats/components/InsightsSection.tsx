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
import { ChartSkeleton, StatCardSkeleton } from './SkeletonLoader';
import type { DateRange } from './DateRangePicker';
import {
  MoneyYTick,
  CountYTick,
  axisTickProps,
  cartesianGridProps,
  chartTheme,
  makeMoneyTooltipContent,
  MsChartTooltip,
  type MsTooltipContentProps
} from './chartKit';

interface InsightsSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

const DAY_KEYS = ['days.sun', 'days.mon', 'days.tue', 'days.wed', 'days.thu', 'days.fri', 'days.sat'];

export const InsightsSection: React.FC<InsightsSectionProps> = ({ dateRange, formatCurrency }) => {
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
  const revenueLabel = t('revenueChart.revenue', 'הכנסה');
  const cancellationsLabel = t('insights.cancellations', 'ביטולים');

  const RevenueTooltip = useMemo(
    () => makeMoneyTooltipContent(revenueLabel, formatCurrency, chartTheme.primary),
    [revenueLabel, formatCurrency]
  );

  const CountTooltip = useMemo(
    () =>
      function CountTooltipContent({ active, payload, label }: MsTooltipContentProps) {
        if (!active || payload?.[0]?.value == null) return null;
        return (
          <MsChartTooltip
            active
            label={label != null ? String(label) : undefined}
            rows={[
              {
                label: cancellationsLabel,
                value: String(payload[0].value),
                color: chartTheme.muted
              }
            ]}
          />
        );
      },
    [cancellationsLabel]
  );

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
    const byTime =
      breakdown?.byTimeOfDay ?? Array.from({ length: 24 }, (_, h) => ({ hour: h, revenue: 0, bookings: 0 }));
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
        <div className="insights-cards">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <ChartSkeleton />
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
        <article className="insight-card">
          <h4>{t('insights.cancellationRate', 'שיעור ביטולים')}</h4>
          <p className="insight-card__value">{cancellation?.cancellationRate ?? 0}%</p>
          <p className="insight-card__sub">
            {t('insights.trend', 'מגמה')}: {cancellation?.trend ?? '0%'}
          </p>
        </article>
        <article className="insight-card">
          <h4>{t('insights.couponImpact', 'השפעת קופונים')}</h4>
          <p className="insight-card__value">{formatCurrency(couponImpact.totalDiscounts)}</p>
          <p className="insight-card__sub">
            {couponImpact.bookingsWithCoupon} {t('insights.bookingsWithCoupon', 'הזמנות עם קופון')} ·{' '}
            {couponImpact.avgDiscountPercent}% {t('insights.avgDiscount', 'ממוצע הנחה')}
          </p>
        </article>
      </div>

      <div className="ms-panel insights-heatmap">
        <div className="ms-panel__header">
          <h3>{t('insights.heatmapTitle', 'הכנסות לפי שעה')}</h3>
          <div className="heatmap-legend" aria-hidden="true">
            <span>{t('insights.heatmapLow', 'נמוך')}</span>
            <span className="heatmap-legend__ramp" />
            <span>{t('insights.heatmapHigh', 'גבוה')}</span>
          </div>
        </div>
        <div className="heatmap-grid">
          {heatmapData.map((cell) => (
            <div
              key={cell.hour}
              className="heatmap-cell"
              style={{
                backgroundColor: chartTheme.primary,
                opacity: 0.08 + cell.intensity * 0.85
              }}
              title={`${cell.hour}:00 — ${formatCurrency(cell.revenue)}`}
            >
              <span className="heatmap-cell__label">{cell.hour}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-charts-row">
        <div className="ms-panel insights-day-chart">
          <h4>{t('insights.revenueByDay', 'הכנסות לפי יום')}</h4>
          <div className="ms-chart-plot" dir="ltr">
            <ResponsiveContainer width="100%" height={chartTheme.heights.md}>
              <BarChart data={byDayData} margin={{ ...chartTheme.margins.bar, left: 4 }}>
                <CartesianGrid {...cartesianGridProps} />
                <XAxis dataKey="name" tick={axisTickProps} axisLine={false} tickLine={false} />
                <YAxis width={1} tick={<MoneyYTick />} axisLine={false} tickLine={false} />
                <Tooltip content={RevenueTooltip} cursor={{ fill: 'var(--bg-hover)', opacity: 0.5 }} />
                <Bar dataKey="revenue" fill={chartTheme.primary} radius={[3, 3, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="ms-panel insights-cancellations">
          <h4>{t('insights.cancellationsByDay', 'ביטולים לפי יום')}</h4>
          <div className="ms-chart-plot" dir="ltr">
            <ResponsiveContainer width="100%" height={chartTheme.heights.md}>
              <BarChart data={cancellationsByDayData} margin={{ ...chartTheme.margins.bar, left: 4 }}>
                <CartesianGrid {...cartesianGridProps} />
                <XAxis dataKey="name" tick={axisTickProps} axisLine={false} tickLine={false} />
                <YAxis width={1} allowDecimals={false} tick={<CountYTick />} axisLine={false} tickLine={false} />
                <Tooltip content={CountTooltip} cursor={{ fill: 'var(--bg-hover)', opacity: 0.5 }} />
                <Bar dataKey="count" fill={chartTheme.muted} radius={[3, 3, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
