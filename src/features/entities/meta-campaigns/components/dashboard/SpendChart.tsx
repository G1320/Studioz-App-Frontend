import React from 'react';
import { useAccountInsights } from '../../hooks/useAccountInsights';
import { formatCurrency } from '../../utils/formatMetrics';
import type { MetaInsight } from '../../types/meta.types';

export const SpendChart: React.FC = () => {
  const { data: insights = [] } = useAccountInsights({
    date_preset: 'last_30d',
    level: 'account'
  });

  // Simple bar-chart representation using CSS
  const maxSpend = Math.max(...insights.map((i: MetaInsight) => parseFloat(i.spend) || 0), 1);

  return (
    <div className="meta-spend-chart">
      {insights.length === 0 ? (
        <div className="meta-spend-chart__empty">No spend data available</div>
      ) : (
        <div className="meta-spend-chart__bars">
          {insights.slice(-14).map((row: MetaInsight, idx: number) => {
            const spend = parseFloat(row.spend) || 0;
            const height = (spend / maxSpend) * 100;
            return (
              <div key={idx} className="meta-spend-chart__bar-group" title={`${row.date_start}: ${formatCurrency(spend)}`}>
                <div className="meta-spend-chart__bar" style={{ height: `${Math.max(height, 2)}%` }} />
                <span className="meta-spend-chart__label">
                  {new Date(row.date_start).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
