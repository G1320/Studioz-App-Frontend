import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useUpdateCampaignStatus } from '../../hooks/useCampaignMutations';
import { CampaignCard } from './CampaignCard';
import { CampaignFilters } from './CampaignFilters';
import type { MetaCampaign } from '../../types/meta.types';

interface CampaignListTabProps {
  onCampaignClick: (id: string) => void;
  onCreateClick: () => void;
}

export const CampaignListTab: React.FC<CampaignListTabProps> = ({ onCampaignClick, onCreateClick }) => {
  const { t } = useTranslation('metaCampaigns');
  const { data: campaigns = [], isLoading } = useCampaigns();
  const updateStatus = useUpdateCampaignStatus();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    let result = campaigns as MetaCampaign[];
    if (statusFilter !== 'all') {
      result = result.filter(c => c.effective_status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [campaigns, statusFilter, searchTerm]);

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return <div className="meta-tab__loader">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="meta-campaign-list">
      <div className="meta-campaign-list__header">
        <h2 className="meta-campaign-list__title">
          {t('campaigns.title', 'Campaigns')} ({filtered.length})
        </h2>
        <button className="meta-btn meta-btn--primary" onClick={onCreateClick}>
          + {t('campaigns.create', 'Create Campaign')}
        </button>
      </div>

      <CampaignFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filtered.length === 0 ? (
        <div className="meta-empty-state">
          <p>{t('campaigns.empty', 'No campaigns found')}</p>
          <button className="meta-btn meta-btn--secondary" onClick={onCreateClick}>
            {t('campaigns.createFirst', 'Create your first campaign')}
          </button>
        </div>
      ) : (
        <div className="meta-campaign-list__grid">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onStatusChange={handleStatusChange}
              onClick={onCampaignClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
