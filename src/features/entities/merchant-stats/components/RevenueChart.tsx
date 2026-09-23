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

const formatAxisValue = (v: number) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`);

const ChartTooltip = ({
  active,
  payload,
  label,
  revenueLabel
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  revenueLabel: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  return (
    <div className="revenue-chart__tooltip">
      <span className="revenue-chart__tooltip-label">{label}</span>
      <span className="revenue-chart__tooltip-value">
        {revenueLabel}: ₪{value.toLocaleString()}
      </span>
    </div>
  );
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ period, onPeriodChange, data: externalData }) => {
  const { t } = useTranslation('merchantStats');

  const chartData = useMemo(() => {
    const values =
      externalData ??
      (period === 'monthly' ? Array(12).fill(0) : period === 'weekly' ? Array(7).fill(0) : Array(24).fill(0));

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

        <div className="revenue-chart__toggle" role="tablist" aria-label={t('revenueChart.title', 'מגמת הכנסות')}>
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={period === p}
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
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 12, bottom: period === 'monthly' ? 40 : 8 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
              interval={period === 'monthly' ? 1 : 0}
              angle={period === 'monthly' ? -30 : 0}
              textAnchor={period === 'monthly' ? 'end' : 'middle'}
              height={period === 'monthly' ? 48 : 28}
            />
            <YAxis
              orientation="left"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', direction: 'ltr' }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={64}
              tickFormatter={formatAxisValue}
            />
            <Tooltip
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload as { value?: number }[] | undefined}
                  label={props.label as string | undefined}
                  revenueLabel={t('revenueChart.revenue', 'הכנסה')}
                />
              )}
              cursor={{ stroke: 'var(--border-hover)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-brand)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
