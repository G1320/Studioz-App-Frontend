import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaigns';
import { useAdSets } from '../hooks/useAdSets';
import { useCampaignInsights } from '../hooks/useCampaignInsights';
import { useUpdateCampaignStatus, useUpdateAdSetStatus } from '../hooks/useCampaignMutations';
import { CampaignStatusBadge } from '../components/campaigns/CampaignStatusBadge';
import { MetaStatusToggle } from '../components/shared/MetaStatusToggle';
import { formatCurrency, formatCompact, formatPercentage, formatDate, parseBudget } from '../utils/formatMetrics';
import type { MetaAdSet, MetaInsight } from '../types/meta.types';

const CampaignDetailPage: React.FC = () => {
  const { t } = useTranslation('metaCampaigns');
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading: campaignLoading } = useCampaign(campaignId || null);
  const { data: adSets = [], isLoading: adSetsLoading } = useAdSets(campaignId || null);
  const { data: insights = [] } = useCampaignInsights(campaignId || null, { date_preset: 'last_30d' });
  const updateCampaignStatus = useUpdateCampaignStatus();
  const updateAdSetStatus = useUpdateAdSetStatus();

  if (campaignLoading || adSetsLoading) {
    return <div className="meta-detail__loader">{t('loading', 'Loading...')}</div>;
  }

  if (!campaign) {
    return <div className="meta-detail__error">{t('campaigns.notFound', 'Campaign not found')}</div>;
  }

  const insightRow = insights[0] as MetaInsight | undefined;

  return (
    <div className="meta-detail">
      <div className="meta-detail__header">
        <button className="meta-btn meta-btn--ghost" onClick={() => navigate(-1)}>
          &larr; {t('actions.back', 'Back')}
        </button>
        <div className="meta-detail__title-row">
          <h1 className="meta-detail__title">{campaign.name}</h1>
          <CampaignStatusBadge status={campaign.effective_status} />
          <MetaStatusToggle
            status={campaign.status}
            onToggle={(newStatus) => updateCampaignStatus.mutate({ id: campaign.id, status: newStatus })}
          />
        </div>
        <div className="meta-detail__meta">
          <span>Objective: {campaign.objective?.replace('OUTCOME_', '').replace(/_/g, ' ')}</span>
          <span>Created: {formatDate(campaign.created_time)}</span>
          {campaign.daily_budget && <span>Budget: {formatCurrency(parseBudget(campaign.daily_budget))}/day</span>}
          {campaign.lifetime_budget && <span>Budget: {formatCurrency(parseBudget(campaign.lifetime_budget))} lifetime</span>}
        </div>
      </div>

      {insightRow && (
        <div className="meta-detail__insights">
          <div className="meta-detail__insight-card">
            <span className="meta-detail__insight-label">Spend</span>
            <span className="meta-detail__insight-value">{formatCurrency(insightRow.spend)}</span>
          </div>
          <div className="meta-detail__insight-card">
            <span className="meta-detail__insight-label">Impressions</span>
            <span className="meta-detail__insight-value">{formatCompact(insightRow.impressions)}</span>
          </div>
          <div className="meta-detail__insight-card">
            <span className="meta-detail__insight-label">Clicks</span>
            <span className="meta-detail__insight-value">{formatCompact(insightRow.clicks || '0')}</span>
          </div>
          <div className="meta-detail__insight-card">
            <span className="meta-detail__insight-label">CTR</span>
            <span className="meta-detail__insight-value">{formatPercentage(insightRow.ctr || '0')}</span>
          </div>
          <div className="meta-detail__insight-card">
            <span className="meta-detail__insight-label">CPC</span>
            <span className="meta-detail__insight-value">{formatCurrency(insightRow.cpc || '0')}</span>
          </div>
        </div>
      )}

      <div className="meta-detail__section">
        <h2 className="meta-detail__section-title">
          {t('adSets.title', 'Ad Sets')} ({adSets.length})
        </h2>
        {adSets.length === 0 ? (
          <p className="meta-detail__empty">{t('adSets.empty', 'No ad sets yet')}</p>
        ) : (
          <div className="meta-detail__table-wrapper">
            <table className="meta-table">
              <thead>
                <tr>
                  <th>{t('table.name', 'Name')}</th>
                  <th>{t('table.status', 'Status')}</th>
                  <th>{t('table.budget', 'Budget')}</th>
                  <th>{t('table.optimization', 'Optimization')}</th>
                  <th>{t('table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {adSets.map((adSet: MetaAdSet) => (
                  <tr key={adSet.id}>
                    <td className="meta-table__name">{adSet.name}</td>
                    <td><CampaignStatusBadge status={adSet.effective_status} /></td>
                    <td>
                      {adSet.daily_budget
                        ? `${formatCurrency(parseBudget(adSet.daily_budget))}/day`
                        : adSet.lifetime_budget
                          ? formatCurrency(parseBudget(adSet.lifetime_budget))
                          : '—'}
                    </td>
                    <td>{adSet.optimization_goal?.replace(/_/g, ' ')}</td>
                    <td>
                      <MetaStatusToggle
                        status={adSet.status}
                        onToggle={(newStatus) => updateAdSetStatus.mutate({ id: adSet.id, status: newStatus })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailPage;
