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
import { CalendarIcon, TrendingUpIcon } from '@shared/components/icons';
import type { DateRange } from './DateRangePicker';

interface ProjectionsSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

const MONTH_KEYS = [
  'months.jan', 'months.feb', 'months.mar', 'months.apr', 'months.may', 'months.jun',
  'months.jul', 'months.aug', 'months.sep', 'months.oct', 'months.nov', 'months.dec'
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
        <div className="merchant-stats__loader">{t('loading', 'טוען נתונים...')}</div>
      </div>
    );
  }

  const confirmedUpcoming = data?.confirmedUpcoming ?? 0;
  const projectedMonthly = data?.projectedMonthly ?? [0, 0, 0];
  const confidence = data?.confidence ?? 'low';

  return (
    <div className="merchant-stats__section merchant-stats__section--projections">
      <div className="projections-cards">
        <div className="projection-card">
          <CalendarIcon style={{ width: 24, height: 24, color: 'var(--color-brand)' }} />
          <div>
            <h4>{t('projections.confirmedUpcoming', 'אישור הזמנות עתידיות')}</h4>
            <p className="projection-card__value">{formatCurrency(confirmedUpcoming)}</p>
          </div>
        </div>
        <div className="projection-card">
          <TrendingUpIcon style={{ width: 24, height: 24, color: 'var(--color-brand)' }} />
          <div>
            <h4>{t('projections.next30Days', 'תחזית 30 יום')}</h4>
            <p className="projection-card__value">{formatCurrency(projectedMonthly[0] ?? 0)}</p>
          </div>
        </div>
        <div className="projection-card">
          <TrendingUpIcon style={{ width: 24, height: 24, color: 'var(--color-brand)' }} />
          <div>
            <h4>{t('projections.next60Days', 'תחזית 60 יום')}</h4>
            <p className="projection-card__value">{formatCurrency(projectedMonthly[1] ?? 0)}</p>
          </div>
        </div>
        <div className="projection-card">
          <TrendingUpIcon style={{ width: 24, height: 24, color: 'var(--color-brand)' }} />
          <div>
            <h4>{t('projections.next90Days', 'תחזית 90 יום')}</h4>
            <p className="projection-card__value">{formatCurrency(projectedMonthly[2] ?? 0)}</p>
          </div>
        </div>
      </div>

      <div className="projections-confidence">
        {t('projections.confidence', 'רמת ביטחון')}:{' '}
        <span className={`projections-confidence__badge projections-confidence__badge--${confidence}`}>
          {t(`projections.confidenceLevel.${confidence}`, confidence)}
        </span>
      </div>

      {chartData.length > 0 && (
        <div className="projections-chart">
          <h3>{t('projections.chartTitle', 'הכנסות בפועל ותחזית')}</h3>
          <p className="projections-chart__subtitle">
            {t('projections.chartSubtitle', 'הקו המקווקו מציג הערכת הכנסות ל־3 החודשים הבאים לפי מגמת החודשים האחרונים')}
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                stroke="var(--border-secondary)"
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickFormatter={(v) => (v >= 1000 ? `₪${(v / 1000).toFixed(0)}k` : `₪${v}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '8px'
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  formatCurrency(value ?? 0),
                  name === 'actual' ? t('projections.actual', 'פועל') : t('projections.projected', 'תחזית')
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                fill="var(--color-brand)"
                fillOpacity={0.3}
                stroke="var(--color-brand)"
                name={t('projections.actual', 'פועל')}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--color-info)"
                strokeDasharray="5 5"
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
