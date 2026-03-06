import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountInsights } from '../../hooks/useAccountInsights';
import { useCampaigns } from '../../hooks/useCampaigns';
import { formatCurrency, formatCompact, formatPercentage } from '../../utils/formatMetrics';
import { CampaignStatusBadge } from '../campaigns/CampaignStatusBadge';
import { SpendChart } from './SpendChart';
import type { MetaInsight, MetaCampaign } from '../../types/meta.types';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle }) => (
  <div className="meta-kpi-card">
    <p className="meta-kpi-card__title">{title}</p>
    <h3 className="meta-kpi-card__value">{value}</h3>
    {subtitle && <p className="meta-kpi-card__subtitle">{subtitle}</p>}
  </div>
);

function extractKpis(insights: MetaInsight[]) {
  if (!insights.length) return { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpm: 0, reach: 0, conversions: 0 };
  const row = insights[0];
  const conversions = row.actions?.find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase');
  return {
    spend: parseFloat(row.spend) || 0,
    impressions: parseInt(row.impressions) || 0,
    clicks: parseInt(row.clicks || '0') || 0,
    ctr: parseFloat(row.ctr || '0') || 0,
    cpc: parseFloat(row.cpc || '0') || 0,
    cpm: parseFloat(row.cpm || '0') || 0,
    reach: parseInt(row.reach || '0') || 0,
    conversions: conversions ? parseInt(conversions.value) : 0
  };
}

export const CampaignOverview: React.FC = () => {
  const { t } = useTranslation('metaCampaigns');
  const { data: insights = [], isLoading: insightsLoading } = useAccountInsights({ date_preset: 'last_30d' });
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns();

  const kpis = extractKpis(insights);
  const activeCampaigns = campaigns.filter((c: MetaCampaign) => c.effective_status === 'ACTIVE');

  if (insightsLoading || campaignsLoading) {
    return <div className="meta-overview__loader">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="meta-overview">
      <div className="meta-overview__kpis">
        <KpiCard title={t('kpi.totalSpend', 'Total Spend')} value={formatCurrency(kpis.spend)} subtitle="Last 30 days" />
        <KpiCard title={t('kpi.impressions', 'Impressions')} value={formatCompact(kpis.impressions)} />
        <KpiCard title={t('kpi.reach', 'Reach')} value={formatCompact(kpis.reach)} />
        <KpiCard title={t('kpi.clicks', 'Clicks')} value={formatCompact(kpis.clicks)} />
        <KpiCard title={t('kpi.ctr', 'CTR')} value={formatPercentage(kpis.ctr)} />
        <KpiCard title={t('kpi.cpc', 'CPC')} value={formatCurrency(kpis.cpc)} />
        <KpiCard title={t('kpi.conversions', 'Conversions')} value={formatCompact(kpis.conversions)} />
        <KpiCard title={t('kpi.cpm', 'CPM')} value={formatCurrency(kpis.cpm)} />
      </div>

      <div className="meta-overview__content">
        <div className="meta-overview__chart-section">
          <h3 className="meta-overview__section-title">{t('overview.spendChart', 'Spend Overview')}</h3>
          <SpendChart />
        </div>

        <div className="meta-overview__active-campaigns">
          <h3 className="meta-overview__section-title">
            {t('overview.activeCampaigns', 'Active Campaigns')} ({activeCampaigns.length})
          </h3>
          <div className="meta-overview__campaign-list">
            {activeCampaigns.slice(0, 5).map((campaign: MetaCampaign) => (
              <div key={campaign.id} className="meta-overview__campaign-row">
                <div className="meta-overview__campaign-info">
                  <span className="meta-overview__campaign-name">{campaign.name}</span>
                  <CampaignStatusBadge status={campaign.effective_status} />
                </div>
                <span className="meta-overview__campaign-budget">
                  {campaign.daily_budget
                    ? `${formatCurrency(parseFloat(campaign.daily_budget) / 100)}/day`
                    : campaign.lifetime_budget
                      ? formatCurrency(parseFloat(campaign.lifetime_budget) / 100)
                      : '—'}
                </span>
              </div>
            ))}
            {activeCampaigns.length === 0 && (
              <p className="meta-overview__empty">{t('overview.noCampaigns', 'No active campaigns')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
