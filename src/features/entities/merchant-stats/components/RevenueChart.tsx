import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export type ChartPeriod = 'daily' | 'weekly' | 'monthly';

interface RevenueChartProps {
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  data?: number[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ period, onPeriodChange, data: externalData }) => {
  const { t } = useTranslation('merchantStats');

  const chartData = useMemo(() => {
    const values = externalData ?? (period === 'monthly'
      ? Array(12).fill(0)
      : period === 'weekly'
        ? Array(7).fill(0)
        : Array(24).fill(0));

    // Monthly: backend sends [11 months ago, ..., current month]. Label each point with actual month + short year.
    const monthLabels: Record<number, string> = {
      0: t('months.jan', 'ינו׳'),
      1: t('months.feb', 'פבר׳'),
      2: t('months.mar', 'מרץ'),
      3: t('months.apr', 'אפר׳'),
      4: t('months.may', 'מאי'),
      5: t('months.jun', 'יונ׳'),
      6: t('months.jul', 'יול׳'),
      7: t('months.aug', 'אוג׳'),
      8: t('months.sep', 'ספט׳'),
      9: t('months.oct', 'אוק׳'),
      10: t('months.nov', 'נוב׳'),
      11: t('months.dec', 'דצמ׳')
    };
    const labels =
      period === 'monthly'
        ? Array.from({ length: 12 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (11 - i));
            const shortYear = String(d.getFullYear()).slice(-2);
            return `${monthLabels[d.getMonth()] ?? ''} ${shortYear}`;
          })
        : period === 'weekly'
          ? [
              t('days.sun', 'א׳'),
              t('days.mon', 'ב׳'),
              t('days.tue', 'ג׳'),
              t('days.wed', 'ד׳'),
              t('days.thu', 'ה׳'),
              t('days.fri', 'ו׳'),
              t('days.sat', 'ש׳')
            ]
          : Array(24)
              .fill('')
              .map((_, i) => (i % 4 === 0 ? `${i}:00` : ''));

    return values.map((value, i) => ({
      name: labels[i] ?? String(i),
      value: typeof value === 'number' ? value : 0
    }));
  }, [period, externalData, t]);

  return (
    <div className="revenue-chart">
      <div className="revenue-chart__header">
        <div className="revenue-chart__title">
          <h2>{t('revenueChart.title', 'מגמת הכנסות')}</h2>
          <p>{t('revenueChart.subtitle', 'הכנסות ברוטו לפני עמלות')}</p>
        </div>

        <div className="revenue-chart__toggle">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`revenue-chart__toggle-btn ${period === p ? 'revenue-chart__toggle-btn--active' : ''}`}
            >
              {p === 'daily'
                ? t('period.daily', 'יומי')
                : p === 'weekly'
                  ? t('period.weekly', 'שבועי')
                  : t('period.monthly', 'חודשי')}
            </button>
          ))}
        </div>
      </div>

      <div className="revenue-chart__recharts">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: period === 'monthly' ? 52 : 24 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              stroke="var(--border-secondary)"
              tickLine={false}
              interval={period === 'monthly' ? 1 : 0}
              angle={period === 'monthly' ? -35 : 0}
              textAnchor={period === 'monthly' ? 'end' : 'middle'}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              stroke="var(--border-secondary)"
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-secondary)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
              formatter={(value: number | undefined) => [`₪${Number(value ?? 0).toLocaleString()}`, t('revenueChart.revenue', 'הכנסה')]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-brand)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
