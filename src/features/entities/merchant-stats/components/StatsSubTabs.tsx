import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewTabs } from '@shared/components';

export type StatsSubTab = 'overview' | 'studios' | 'customers' | 'projections' | 'insights';

interface StatsSubTabsProps {
  activeTab: StatsSubTab;
  onTabChange: (tab: StatsSubTab) => void;
}

const TAB_DEFS: { key: StatsSubTab; labelKey: string; fallback: string }[] = [
  { key: 'overview', labelKey: 'tabs.overview', fallback: 'סקירה' },
  { key: 'studios', labelKey: 'tabs.studios', fallback: 'אולפנים' },
  { key: 'customers', labelKey: 'tabs.customers', fallback: 'לקוחות' },
  { key: 'projections', labelKey: 'tabs.projections', fallback: 'תחזית' },
  { key: 'insights', labelKey: 'tabs.insights', fallback: 'תובנות' }
];

export const StatsSubTabs: React.FC<StatsSubTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('merchantStats');

  const tabs = useMemo(
    () => TAB_DEFS.map((tab) => ({ key: tab.key, label: t(tab.labelKey, tab.fallback) })),
    [t]
  );

  return <ViewTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
