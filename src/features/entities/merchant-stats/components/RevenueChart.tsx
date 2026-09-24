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
import {
  MoneyYTick,
  axisTickProps,
  cartesianGridProps,
  chartTheme,
  makeMoneyTooltipContent
} from './chartKit';

export type ChartPeriod = 'daily' | 'weekly' | 'monthly';

interface RevenueChartProps {
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  data?: number[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ period, onPeriodChange, data: externalData }) => {
  const { t } = useTranslation('merchantStats');
  const revenueLabel = t('revenueChart.revenue', 'הכנסה');
  const TooltipContent = useMemo(
    () => makeMoneyTooltipContent(revenueLabel),
    [revenueLabel]
  );

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

      <div className="revenue-chart__recharts ms-chart-plot" dir="ltr">
        <ResponsiveContainer width="100%" height={chartTheme.heights.lg}>
          <AreaChart
            data={chartData}
            margin={{
              ...chartTheme.margins.area,
              bottom: period === 'monthly' ? 28 : 4,
              left: 4
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartTheme.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartTheme.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...cartesianGridProps} />
            <XAxis
              dataKey="name"
              tick={axisTickProps}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
              interval={period === 'monthly' ? 1 : 0}
              angle={period === 'monthly' ? -30 : 0}
              textAnchor={period === 'monthly' ? 'end' : 'middle'}
              height={period === 'monthly' ? 40 : 24}
            />
            <YAxis
              orientation="left"
              width={1}
              tick={<MoneyYTick />}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={TooltipContent}
              cursor={{ stroke: chartTheme.cursor, strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartTheme.primary}
              strokeWidth={2}
              fill="url(#revenueGradient)"
              activeDot={{ r: 3.5, strokeWidth: 0, fill: chartTheme.primary }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
