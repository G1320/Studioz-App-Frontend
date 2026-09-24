import React, { useState, useMemo } from 'react';
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
import { useStudioAnalytics } from '@shared/hooks';
import { ChartSkeleton, StatCardSkeleton } from './SkeletonLoader';
import type { DateRange } from './DateRangePicker';
import {
  formatMoneyAxis,
  axisTickProps,
  chartTheme,
  makeMoneyTooltipContent
} from './chartKit';

interface StudioBreakdownSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

export const StudioBreakdownSection: React.FC<StudioBreakdownSectionProps> = ({
  dateRange,
  formatCurrency
}) => {
  const { t } = useTranslation('merchantStats');
  const { data, isLoading } = useStudioAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });
  const [expandedStudioId, setExpandedStudioId] = useState<string | null>(null);
  const revenueLabel = t('revenueChart.revenue', 'הכנסה');
  const TooltipContent = useMemo(
    () => makeMoneyTooltipContent(revenueLabel, formatCurrency, chartTheme.primary),
    [revenueLabel, formatCurrency]
  );

  const studios = data?.studios ?? [];
  const chartData = useMemo(
    () =>
      studios.map((s) => ({
        name: s.studioName || s.studioId,
        revenue: s.revenue,
        bookings: s.bookingCount
      })),
    [studios]
  );

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--studios">
        <div className="studio-cards-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="merchant-stats__section merchant-stats__section--studios">
      <div className="studio-cards-grid">
        {studios.map((studio) => {
          const expanded = expandedStudioId === studio.studioId;
          return (
            <div key={studio.studioId} className={`studio-card ${expanded ? 'studio-card--expanded' : ''}`}>
              <button
                type="button"
                className="studio-card__header"
                aria-expanded={expanded}
                onClick={() => setExpandedStudioId(expanded ? null : studio.studioId)}
              >
                <div className="studio-card__title-block">
                  <h3 className="studio-card__name">{studio.studioName}</h3>
                  <span className="studio-card__trend">{studio.growthTrend}</span>
                </div>
                <span className="studio-card__revenue">{formatCurrency(studio.revenue)}</span>
              </button>
              <div className="studio-card__body">
                <div className="studio-card__meta">
                  <div className="studio-card__meta-item">
                    <span className="studio-card__meta-label">{t('studios.bookings', 'הזמנות')}</span>
                    <span className="studio-card__meta-value">{studio.bookingCount}</span>
                  </div>
                  <div className="studio-card__meta-item">
                    <span className="studio-card__meta-label">{t('studios.avgBooking', 'ממוצע')}</span>
                    <span className="studio-card__meta-value">{formatCurrency(studio.avgBookingValue)}</span>
                  </div>
                  <div className="studio-card__meta-item">
                    <span className="studio-card__meta-label">{t('studios.occupancy', 'תפוסה')}</span>
                    <span className="studio-card__meta-value">{studio.occupancy}%</span>
                  </div>
                </div>
                {expanded && (
                  <div className="studio-card__detail">
                    <div className="studio-card__top-items">
                      <h4>{t('studios.topItems', 'פריטים מובילים')}</h4>
                      <ul>
                        {studio.topItems.map((item) => (
                          <li key={item.itemId}>
                            <span>{item.name || item.itemId}</span>
                            <span>
                              {item.bookings} · {formatCurrency(item.revenue)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="studio-card__top-customers">
                      <h4>{t('studios.topCustomers', 'לקוחות מובילים')}</h4>
                      <ul>
                        {studio.topCustomers.map((c) => (
                          <li key={c.id}>
                            <span>{c.name}</span>
                            <span>
                              {formatCurrency(c.totalSpent)} · {c.bookingsCount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {chartData.length > 0 && (
        <div className="ms-panel studio-comparison-chart">
          <div className="ms-panel__header">
            <h3>{t('studios.comparison', 'השוואת אולפנים')}</h3>
          </div>
          <div className="studio-comparison-chart__body" dir="ltr">
            <ul className="studio-comparison-chart__labels" style={{ height: Math.max(160, chartData.length * 40) }}>
              {chartData.map((item) => (
                <li key={item.name} className="studio-comparison-chart__label" title={item.name}>
                  {item.name}
                </li>
              ))}
            </ul>
            <div className="studio-comparison-chart__chart ms-chart-plot">
              <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 40 + 32)}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={axisTickProps}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatMoneyAxis}
                  />
                  <YAxis type="category" dataKey="name" width={0} tick={false} axisLine={false} tickLine={false} />
                  <Tooltip content={TooltipContent} cursor={{ fill: 'var(--bg-hover)', opacity: 0.45 }} />
                  <Bar dataKey="revenue" fill={chartTheme.primary} radius={[0, 3, 3, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {studios.length === 0 && (
        <div className="merchant-stats__empty">
          <p>{t('studios.noStudios', 'אין נתוני אולפנים בתקופה זו')}</p>
        </div>
      )}
    </div>
  );
};
