import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountInsights } from '../../hooks/useAccountInsights';
import { formatCurrency, formatCompact, formatPercentage } from '../../utils/formatMetrics';
import type { MetaInsight, InsightsParams } from '../../types/meta.types';

type DatePreset = 'today' | 'yesterday' | 'last_7d' | 'last_14d' | 'last_30d' | 'last_90d';
type BreakdownType = '' | 'age' | 'gender' | 'country' | 'publisher_platform' | 'device_platform';

export const AnalyticsTab: React.FC = () => {
  const { t } = useTranslation('metaCampaigns');
  const [datePreset, setDatePreset] = useState<DatePreset>('last_30d');
  const [breakdown, setBreakdown] = useState<BreakdownType>('');

  const params: InsightsParams = useMemo(() => ({
    date_preset: datePreset,
    ...(breakdown && { breakdowns: breakdown })
  }), [datePreset, breakdown]);

  const { data: insights = [], isLoading } = useAccountInsights(params);

  const totalSpend = insights.reduce((sum: number, i: MetaInsight) => sum + (parseFloat(i.spend) || 0), 0);
  const totalImpressions = insights.reduce((sum: number, i: MetaInsight) => sum + (parseInt(i.impressions) || 0), 0);
  const totalClicks = insights.reduce((sum: number, i: MetaInsight) => sum + (parseInt(i.clicks || '0') || 0), 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const exportCsv = () => {
    if (!insights.length) return;
    const headers = Object.keys(insights[0]).filter(k => k !== 'actions' && k !== 'cost_per_action_type');
    const rows = insights.map((row: MetaInsight) =>
      headers.map(h => (row as unknown as Record<string, unknown>)[h] ?? '').join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta-analytics-${datePreset}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="meta-analytics">
      <div className="meta-analytics__header">
        <h2 className="meta-analytics__title">{t('analytics.title', 'Analytics')}</h2>
        <div className="meta-analytics__controls">
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as DatePreset)}
            className="meta-select"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7d">Last 7 days</option>
            <option value="last_14d">Last 14 days</option>
            <option value="last_30d">Last 30 days</option>
            <option value="last_90d">Last 90 days</option>
          </select>
          <select
            value={breakdown}
            onChange={(e) => setBreakdown(e.target.value as BreakdownType)}
            className="meta-select"
          >
            <option value="">No Breakdown</option>
            <option value="age">By Age</option>
            <option value="gender">By Gender</option>
            <option value="country">By Country</option>
            <option value="publisher_platform">By Platform</option>
            <option value="device_platform">By Device</option>
          </select>
          <button className="meta-btn meta-btn--secondary" onClick={exportCsv} disabled={!insights.length}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="meta-analytics__summary">
        <div className="meta-kpi-card">
          <p className="meta-kpi-card__title">Total Spend</p>
          <h3 className="meta-kpi-card__value">{formatCurrency(totalSpend)}</h3>
        </div>
        <div className="meta-kpi-card">
          <p className="meta-kpi-card__title">Impressions</p>
          <h3 className="meta-kpi-card__value">{formatCompact(totalImpressions)}</h3>
        </div>
        <div className="meta-kpi-card">
          <p className="meta-kpi-card__title">Clicks</p>
          <h3 className="meta-kpi-card__value">{formatCompact(totalClicks)}</h3>
        </div>
        <div className="meta-kpi-card">
          <p className="meta-kpi-card__title">Avg CTR</p>
          <h3 className="meta-kpi-card__value">{formatPercentage(avgCtr)}</h3>
        </div>
      </div>

      {isLoading ? (
        <div className="meta-tab__loader">{t('loading', 'Loading...')}</div>
      ) : insights.length === 0 ? (
        <div className="meta-empty-state">
          <p>{t('analytics.empty', 'No analytics data available for this period')}</p>
        </div>
      ) : (
        <div className="meta-analytics__table-wrapper">
          <table className="meta-table">
            <thead>
              <tr>
                {breakdown && <th>{breakdown.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</th>}
                <th>Date</th>
                <th>Spend</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>CPM</th>
              </tr>
            </thead>
            <tbody>
              {insights.map((row: MetaInsight, idx: number) => (
                <tr key={idx}>
                  {breakdown && <td>{(row as unknown as Record<string, unknown>)[breakdown] as string || '—'}</td>}
                  <td>{row.date_start}</td>
                  <td>{formatCurrency(row.spend)}</td>
                  <td>{formatCompact(row.impressions)}</td>
                  <td>{formatCompact(row.clicks || '0')}</td>
                  <td>{formatPercentage(row.ctr || '0')}</td>
                  <td>{formatCurrency(row.cpc || '0')}</td>
                  <td>{formatCurrency(row.cpm || '0')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
