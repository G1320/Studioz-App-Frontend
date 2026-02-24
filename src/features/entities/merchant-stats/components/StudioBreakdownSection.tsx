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
import type { DateRange } from './DateRangePicker';

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
        <div className="merchant-stats__loader">{t('loading', 'טוען נתונים...')}</div>
      </div>
    );
  }

  return (
    <div className="merchant-stats__section merchant-stats__section--studios">
      <div className="studio-cards-grid">
        {studios.map((studio) => (
          <div
            key={studio.studioId}
            className={`studio-card ${expandedStudioId === studio.studioId ? 'studio-card--expanded' : ''}`}
          >
            <button
              type="button"
              className="studio-card__header"
              onClick={() =>
                setExpandedStudioId(expandedStudioId === studio.studioId ? null : studio.studioId)
              }
            >
              <h3 className="studio-card__name">{studio.studioName}</h3>
              <span className="studio-card__revenue">{formatCurrency(studio.revenue)}</span>
              <span className="studio-card__trend">{studio.growthTrend}</span>
            </button>
            <div className="studio-card__body">
              <div className="studio-card__meta">
                <span>{t('studios.bookings', 'הזמנות')}: {studio.bookingCount}</span>
                <span>{t('studios.avgBooking', 'ממוצע')}: {formatCurrency(studio.avgBookingValue)}</span>
                <span>{t('studios.occupancy', 'תפוסה')}: {studio.occupancy}%</span>
              </div>
              {expandedStudioId === studio.studioId && (
                <div className="studio-card__detail">
                  <div className="studio-card__top-items">
                    <h4>{t('studios.topItems', 'פריטים מובילים')}</h4>
                    <ul>
                      {studio.topItems.map((item) => (
                        <li key={item.itemId}>
                          {item.name || item.itemId}: {item.bookings} {t('studios.bookings', 'הזמנות')}, {formatCurrency(item.revenue)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="studio-card__top-customers">
                    <h4>{t('studios.topCustomers', 'לקוחות מובילים')}</h4>
                    <ul>
                      {studio.topCustomers.map((c) => (
                        <li key={c.id}>
                          {c.name}: {formatCurrency(c.totalSpent)}, {c.bookingsCount} {t('studios.bookings', 'הזמנות')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="studio-comparison-chart">
          <h3>{t('studios.comparison', 'השוואת אולפנים')}</h3>
          <div className="studio-comparison-chart__wrap">
            <div className="studio-comparison-chart__labels" aria-hidden="true">
              {chartData.map((item) => (
                <div key={item.name} className="studio-comparison-chart__label">
                  {item.name}
                </div>
              ))}
            </div>
            <div className="studio-comparison-chart__chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 12, right: 16, bottom: 12, left: 0 }}
                  barCategoryGap={14}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.5} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                    tickFormatter={(v) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`)}
                  />
                  <YAxis type="category" dataKey="name" width={0} tick={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number | undefined) => [formatCurrency(value ?? 0), t('revenueChart.revenue', 'הכנסה')]}
                  />
                  <Bar dataKey="revenue" fill="var(--color-brand)" radius={[0, 4, 4, 0]} barSize={28} />
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
