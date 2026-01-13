import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type ChartPeriod = 'daily' | 'weekly' | 'monthly';

interface RevenueChartProps {
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  data?: number[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ period, onPeriodChange, data: externalData }) => {
  const { t } = useTranslation('merchantStats');

  // Mock data generation based on period (use external data if provided)
  const chartData = useMemo(() => {
    if (externalData) return externalData;

    switch (period) {
      case 'monthly':
        return [65, 45, 75, 55, 85, 70, 95, 80, 60, 75, 90, 100]; // 12 months
      case 'weekly':
        return [40, 65, 50, 85, 60, 90, 75]; // 7 days
      case 'daily':
      default:
        return [30, 45, 35, 60, 40, 75, 50, 65, 55, 80, 70, 95, 60, 85, 75, 90, 65, 80, 70, 85, 60, 75, 55, 70]; // 24 hours
    }
  }, [period, externalData]);

  const labels = useMemo(() => {
    switch (period) {
      case 'monthly':
        return [
          t('months.jan', 'ינו׳'),
          t('months.feb', 'פבר׳'),
          t('months.mar', 'מרץ'),
          t('months.apr', 'אפר׳'),
          t('months.may', 'מאי'),
          t('months.jun', 'יונ׳'),
          t('months.jul', 'יול׳'),
          t('months.aug', 'אוג׳'),
          t('months.sep', 'ספט׳'),
          t('months.oct', 'אוק׳'),
          t('months.nov', 'נוב׳'),
          t('months.dec', 'דצמ׳')
        ];
      case 'weekly':
        return [
          t('days.sun', 'א׳'),
          t('days.mon', 'ב׳'),
          t('days.tue', 'ג׳'),
          t('days.wed', 'ד׳'),
          t('days.thu', 'ה׳'),
          t('days.fri', 'ו׳'),
          t('days.sat', 'ש׳')
        ];
      case 'daily':
      default:
        return Array(24)
          .fill('')
          .map((_, i) => (i % 4 === 0 ? `${i}:00` : ''));
    }
  }, [period, t]);

  const maxVal = Math.max(...chartData);

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

      <div className="chart-container">
        {/* Grid Lines */}
        <div className="chart-grid">
          <div className="grid-line" />
          <div className="grid-line" />
          <div className="grid-line" />
          <div className="grid-line" />
        </div>

        {chartData.map((val, i) => (
          <div key={i} className="chart-bar-wrapper">
            <div className="chart-bar-container">
              {/* Tooltip */}
              <div className="chart-tooltip">₪{(val * 150).toLocaleString()}</div>
              {/* Bar */}
              <div className="chart-bar" style={{ height: `${(val / maxVal) * 100}%` }} />
            </div>
            {/* Label */}
            <div className="chart-label">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
