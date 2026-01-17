import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Studio } from 'src/types/index';
import { useReservations } from '@shared/hooks';
import { DashboardCalendar, RecentActivity } from '../components';
import { StudioManager } from '@features/entities/studios';

import MerchantStatsPage from '@features/entities/merchant-stats/pages/MerchantStatsPage';
import MerchantDocumentsPage from '@features/entities/merchant-documents/pages/MerchantDocumentsPage';

// Subtle fade transition for view switching
const viewTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

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

      {/* Tab Content with transition */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            className="dashboard-content"
            {...viewTransition}
          >
            {isStudioOwner && (
              <RecentActivity
                studioIds={userStudios.map((s) => s._id)}
                isStudioOwner={isStudioOwner}
                limit={4}
              />
            )}
            <DashboardCalendar
              studios={userStudios}
              reservations={reservations}
              isStudioOwner={isStudioOwner}
            />
          </motion.div>
        )}

        {activeTab === 'studios' && isStudioOwner && (
          <motion.div key="studios" {...viewTransition}>
            <StudioManager studios={userStudios} />
          </motion.div>
        )}

        {activeTab === 'stats' && isStudioOwner && (
          <motion.div key="stats" {...viewTransition}>
            <MerchantStatsPage />
          </motion.div>
        )}

        {activeTab === 'documents' && isStudioOwner && (
          <motion.div key="documents" {...viewTransition}>
            <MerchantDocumentsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;

