import React from 'react';
import { useTranslation } from 'react-i18next';

interface CampaignFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange
}) => {
  const { t } = useTranslation('metaCampaigns');

  return (
    <div className="meta-filters">
      <div className="meta-filters__search">
        <input
          type="text"
          placeholder={t('campaigns.searchPlaceholder', 'Search campaigns...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="meta-filters__input"
        />
      </div>
      <div className="meta-filters__status">
        {['all', 'ACTIVE', 'PAUSED', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            className={`meta-filters__status-btn ${statusFilter === status ? 'meta-filters__status-btn--active' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            {status === 'all' ? t('filters.all', 'All') : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
