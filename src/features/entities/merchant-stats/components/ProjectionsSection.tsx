import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useProjections } from '@shared/hooks';
import { ChartSkeleton, StatCardSkeleton } from './SkeletonLoader';
import type { DateRange } from './DateRangePicker';

interface ProjectionsSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

const MONTH_KEYS = [
  'months.jan',
  'months.feb',
  'months.mar',
  'months.apr',
  'months.may',
  'months.jun',
  'months.jul',
  'months.aug',
  'months.sep',
  'months.oct',
  'months.nov',
  'months.dec'
];

export const ProjectionsSection: React.FC<ProjectionsSectionProps> = ({ formatCurrency }) => {
  const { t } = useTranslation('merchantStats');
  const { data, isLoading } = useProjections();

  const chartData = useMemo(() => {
    if (!data) return [];
    const actuals = data.monthlyActuals ?? [];
    const projected = data.projectedLine ?? [];
    const now = new Date();
    const result: { name: string; actual: number; projected?: number; isProjected?: boolean }[] = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const monthLabel = t(MONTH_KEYS[d.getMonth()], String(d.getMonth() + 1));
      const isCurrentMonth = i === 11;
      result.push({
        name: monthLabel,
        actual: actuals[i] ?? 0,
        projected: isCurrentMonth ? (actuals[11] ?? 0) : undefined,
        isProjected: false
      });
    }
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
      const monthLabel = t(MONTH_KEYS[d.getMonth()], String(d.getMonth() + 1));
      result.push({
        name: monthLabel,
        actual: 0,
        projected: projected[i] ?? 0,
        isProjected: true
      });
    }
    return result;
  }, [data, t]);

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--projections">
        <div className="projections-cards">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  const confirmedUpcoming = data?.confirmedUpcoming ?? 0;
  const projectedMonthly = data?.projectedMonthly ?? [0, 0, 0];
  const confidence = data?.confidence ?? 'low';

  return (
    <div className="merchant-stats__section merchant-stats__section--projections">
      <div className="projections-cards">
        <article className="projection-card">
          <h4>{t('projections.confirmedUpcoming', 'אישור הזמנות עתידיות')}</h4>
          <p className="projection-card__value">{formatCurrency(confirmedUpcoming)}</p>
        </article>
        <article className="projection-card">
          <h4>{t('projections.next30Days', 'תחזית 30 יום')}</h4>
          <p className="projection-card__value">{formatCurrency(projectedMonthly[0] ?? 0)}</p>
        </article>
        <article className="projection-card">
          <h4>{t('projections.next60Days', 'תחזית 60 יום')}</h4>
          <p className="projection-card__value">{formatCurrency(projectedMonthly[1] ?? 0)}</p>
        </article>
        <article className="projection-card">
          <h4>{t('projections.next90Days', 'תחזית 90 יום')}</h4>
          <p className="projection-card__value">{formatCurrency(projectedMonthly[2] ?? 0)}</p>
        </article>
      </div>

      <div className="projections-confidence">
        <span className="projections-confidence__label">{t('projections.confidence', 'רמת ביטחון')}</span>
        <span className={`projections-confidence__badge projections-confidence__badge--${confidence}`}>
          {t(`projections.confidenceLevel.${confidence}`, confidence)}
        </span>
      </div>

      {chartData.length > 0 && (
        <div className="ms-panel projections-chart">
          <div className="ms-panel__header">
            <div>
              <h3>{t('projections.chartTitle', 'הכנסות בפועל ותחזית')}</h3>
              <p className="ms-panel__subtitle">
                {t(
                  'projections.chartSubtitle',
                  'הקו המקווקו מציג הערכת הכנסות ל־3 החודשים הבאים לפי מגמת החודשים האחרונים'
                )}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={(v) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '6px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  formatCurrency(value ?? 0),
                  name === 'actual' ? t('projections.actual', 'פועל') : t('projections.projected', 'תחזית')
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              <Area
                type="monotone"
                dataKey="actual"
                fill="var(--color-brand)"
                fillOpacity={0.12}
                stroke="var(--color-brand)"
                strokeWidth={2}
                name={t('projections.actual', 'פועל')}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--text-secondary)"
                strokeDasharray="4 4"
                strokeWidth={1.75}
                dot={false}
                connectNulls={false}
                name={t('projections.projected', 'תחזית')}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
