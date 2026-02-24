import React from 'react';
import { useTranslation } from 'react-i18next';

export type StatsSubTab = 'overview' | 'studios' | 'customers' | 'projections' | 'insights';

interface StatsSubTabsProps {
  activeTab: StatsSubTab;
  onTabChange: (tab: StatsSubTab) => void;
}

const TABS: { key: StatsSubTab; labelKey: string }[] = [
  { key: 'overview', labelKey: 'tabs.overview' },
  { key: 'studios', labelKey: 'tabs.studios' },
  { key: 'customers', labelKey: 'tabs.customers' },
  { key: 'projections', labelKey: 'tabs.projections' },
  { key: 'insights', labelKey: 'tabs.insights' }
];

export const StatsSubTabs: React.FC<StatsSubTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('merchantStats');

  return (
    <div className="stats-sub-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`stats-sub-tabs__tab ${activeTab === tab.key ? 'stats-sub-tabs__tab--active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {t(tab.labelKey, tab.key === 'overview' ? 'סקירה' : tab.key === 'studios' ? 'אולפנים' : tab.key === 'customers' ? 'לקוחות' : tab.key === 'projections' ? 'תחזית' : 'תובנות')}
        </button>
      ))}
    </div>
  );
};
