import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { User, Studio } from 'src/types/index';
import { useReservations } from '@shared/hooks';
import { DashboardCalendar, RecentActivity } from '../components';
import { StudioManager } from '@features/entities/studios';

import MerchantStatsPage from '@features/entities/merchant-stats/pages/MerchantStatsPage';
import MerchantDocumentsPage from '@features/entities/merchant-documents/pages/MerchantDocumentsPage';

type DashboardTab = 'overview' | 'studios' | 'stats' | 'documents';

const VALID_TABS: DashboardTab[] = ['overview', 'studios', 'stats', 'documents'];

interface DashboardPageProps {
  user: User | null;
  studios: Studio[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  studios
}) => {
  const { t } = useTranslation('dashboard');
  const { data: reservations = [] } = useReservations();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL, default to 'studios'
  const activeTab = useMemo((): DashboardTab => {
    const tabParam = searchParams.get('tab') as DashboardTab | null;
    return tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'studios';
  }, [searchParams]);

  // Update tab in URL
  const setActiveTab = useCallback((tab: DashboardTab) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (tab === 'studios') {
        // Remove tab param for default value to keep URL clean
        newParams.delete('tab');
      } else {
        newParams.set('tab', tab);
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Determine if user is a studio owner
  const isStudioOwner = useMemo(() => {
    if (!user?._id) return false;
    return studios.some((studio) => studio.createdBy === user._id);
  }, [user?._id, studios]);

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {t('welcome', { name: user?.name || t('guest') })}
        </h1>
        {isStudioOwner && (
          <p className="dashboard-subtitle">{t('studioOwnerSubtitle')}</p>
        )}
      </div>

      {/* Tab Navigation for Studio Owners */}
      {isStudioOwner && (
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'studios' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('studios')}
          >
            {t('tabs.manageStudios', 'ניהול נכסים')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'overview' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('tabs.overview', 'יומן פעילות')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'stats' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            {t('tabs.stats', 'סטטיסטיקות')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'documents' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            {t('tabs.documents', 'מסמכים')}
          </button>
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          {/* Recent Activity Section - Only for studio owners */}
          {isStudioOwner && (
            <RecentActivity
              studioIds={userStudios.map((s) => s._id)}
              isStudioOwner={isStudioOwner}
              limit={4}
            />
          )}

          {/* Calendar Section */}
          <DashboardCalendar
            studios={userStudios}
            reservations={reservations}
            isStudioOwner={isStudioOwner}
          />
        </div>
      )}

      {/* Studios Management Tab Content */}
      {activeTab === 'studios' && isStudioOwner && (
        <StudioManager studios={userStudios} />
      )}

      {/* Stats Tab Content */}
      {activeTab === 'stats' && isStudioOwner && (
        <MerchantStatsPage />
      )}

      {/* Documents Tab Content */}
      {activeTab === 'documents' && isStudioOwner && (
        <MerchantDocumentsPage />
      )}
    </div>
  );
};

export default DashboardPage;

