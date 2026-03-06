import '../styles/meta-campaigns.scss';
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CampaignOverview } from '../components/dashboard/CampaignOverview';
import { CampaignListTab } from '../components/campaigns/CampaignListTab';
import { AudienceListTab } from '../components/audiences/AudienceListTab';
import { AnalyticsTab } from '../components/analytics/AnalyticsTab';
import type { MetaCampaignsTab } from '../types/meta.types';

const VALID_TABS: MetaCampaignsTab[] = ['overview', 'campaigns', 'audiences', 'analytics'];

const TAB_LABELS: Record<MetaCampaignsTab, { en: string; he: string }> = {
  overview: { en: 'Overview', he: 'סקירה כללית' },
  campaigns: { en: 'Campaigns', he: 'קמפיינים' },
  audiences: { en: 'Audiences', he: 'קהלים' },
  analytics: { en: 'Analytics', he: 'אנליטיקס' }
};

const MetaCampaignsPage: React.FC = () => {
  const { t, i18n } = useTranslation('metaCampaigns');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isHe = i18n.language === 'he';

  const activeTab = useMemo((): MetaCampaignsTab => {
    const tabParam = searchParams.get('tab') as MetaCampaignsTab | null;
    return tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'overview';
  }, [searchParams]);

  const setActiveTab = useCallback((tab: MetaCampaignsTab) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (tab === 'overview') {
        newParams.delete('tab');
      } else {
        newParams.set('tab', tab);
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  const handleCampaignClick = useCallback((id: string) => {
    navigate(`/${i18n.language}/admin/meta-campaigns/${id}`);
  }, [navigate, i18n.language]);

  const handleCreateClick = useCallback(() => {
    navigate(`/${i18n.language}/admin/meta-campaigns/create`);
  }, [navigate, i18n.language]);

  return (
    <div className="meta-campaigns-page">
      <div className="meta-campaigns-page__header">
        <div className="meta-campaigns-page__title-row">
          <h1 className="meta-campaigns-page__title">
            {t('page.title', 'Meta Campaigns')}
          </h1>
          <span className="meta-campaigns-page__subtitle">
            {t('page.subtitle', 'Manage your Meta advertising campaigns')}
          </span>
        </div>
      </div>

      <nav className="meta-campaigns-page__tabs">
        {VALID_TABS.map((tab) => (
          <button
            key={tab}
            className={`meta-campaigns-page__tab ${activeTab === tab ? 'meta-campaigns-page__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {isHe ? TAB_LABELS[tab].he : TAB_LABELS[tab].en}
          </button>
        ))}
      </nav>

      <div className="meta-campaigns-page__content">
        {activeTab === 'overview' && <CampaignOverview />}
        {activeTab === 'campaigns' && (
          <CampaignListTab
            onCampaignClick={handleCampaignClick}
            onCreateClick={handleCreateClick}
          />
        )}
        {activeTab === 'audiences' && <AudienceListTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default MetaCampaignsPage;
