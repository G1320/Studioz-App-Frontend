import React from 'react';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { MetaStatusToggle } from '../shared/MetaStatusToggle';
import { formatCurrency, formatDate, parseBudget } from '../../utils/formatMetrics';
import type { MetaCampaign } from '../../types/meta.types';

interface CampaignCardProps {
  campaign: MetaCampaign;
  onStatusChange: (id: string, status: string) => void;
  onClick: (id: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onStatusChange, onClick }) => {
  const budget = campaign.daily_budget
    ? `${formatCurrency(parseBudget(campaign.daily_budget))}/day`
    : campaign.lifetime_budget
      ? formatCurrency(parseBudget(campaign.lifetime_budget))
      : '—';

  return (
    <div className="meta-campaign-card" onClick={() => onClick(campaign.id)}>
      <div className="meta-campaign-card__header">
        <div className="meta-campaign-card__title-row">
          <h4 className="meta-campaign-card__name">{campaign.name}</h4>
          <CampaignStatusBadge status={campaign.effective_status} />
        </div>
        <span className="meta-campaign-card__objective">
          {campaign.objective?.replace('OUTCOME_', '').replace(/_/g, ' ')}
        </span>
      </div>

      <div className="meta-campaign-card__details">
        <div className="meta-campaign-card__detail">
          <span className="meta-campaign-card__detail-label">Budget</span>
          <span className="meta-campaign-card__detail-value">{budget}</span>
        </div>
        <div className="meta-campaign-card__detail">
          <span className="meta-campaign-card__detail-label">Remaining</span>
          <span className="meta-campaign-card__detail-value">
            {campaign.budget_remaining ? formatCurrency(parseBudget(campaign.budget_remaining)) : '—'}
          </span>
        </div>
        <div className="meta-campaign-card__detail">
          <span className="meta-campaign-card__detail-label">Created</span>
          <span className="meta-campaign-card__detail-value">{formatDate(campaign.created_time)}</span>
        </div>
      </div>

      <div className="meta-campaign-card__actions" onClick={(e) => e.stopPropagation()}>
        <MetaStatusToggle
          status={campaign.status}
          onToggle={(newStatus) => onStatusChange(campaign.id, newStatus)}
        />
      </div>
    </div>
  );
};
