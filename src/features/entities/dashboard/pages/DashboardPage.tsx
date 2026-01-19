import React, { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { User, Studio } from 'src/types/index';
import { useReservations } from '@shared/hooks';
import { DashboardCalendar, RecentActivity, QuickActions, ManualBookingModal } from '../components';
import { StudioManager, StudioBlockModal } from '@features/entities/studios';
import { QuickChargeModal, NewInvoiceModal } from '@features/entities/merchant-documents';

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
  const { t, i18n } = useTranslation('dashboard');
  const { data: reservations = [] } = useReservations();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal states
  const [isQuickChargeOpen, setIsQuickChargeOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [manualBookingStudioId, setManualBookingStudioId] = useState<string | undefined>(undefined);
  const [blockTimeStudioId, setBlockTimeStudioId] = useState<string | null>(null);

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

  // Helper to get localized studio name
  const getLocalizedName = useCallback((name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  }, [i18n.language]);

  // Get the studio being blocked (for the modal)
  const blockTimeStudio = useMemo(() => {
    if (!blockTimeStudioId) return null;
    return userStudios.find(s => s._id === blockTimeStudioId) || null;
  }, [blockTimeStudioId, userStudios]);

  // Quick action handlers
  const handleQuickCharge = useCallback(() => {
    setIsQuickChargeOpen(true);
  }, []);

  const handleNewInvoice = useCallback(() => {
    setIsNewInvoiceOpen(true);
  }, []);

  const handleBlockTime = useCallback((studioId: string) => {
    setBlockTimeStudioId(studioId);
  }, []);

  const handleNewReservation = useCallback((studioId?: string) => {
    setManualBookingStudioId(studioId);
    setIsManualBookingOpen(true);
  }, []);

  const handleDownloadReport = useCallback(() => {
    // Generate and download a quick CSV report
    const rows: string[][] = [];
    const now = dayjs();
    const monthStart = now.startOf('month').format('DD/MM/YYYY');
    const monthEnd = now.endOf('month').format('DD/MM/YYYY');

    rows.push([t('quickActions.downloadReport', 'Quick Report')]);
    rows.push([`${monthStart} - ${monthEnd}`]);
    rows.push([t('stats.generatedAt', 'Generated'), now.format('DD/MM/YYYY HH:mm')]);
    rows.push([]);

    rows.push([t('stats.activeStudios', 'Active Studios'), String(userStudios.length)]);
    rows.push([t('stats.upcomingBookings', 'Upcoming Bookings'), String(reservations.filter(r => dayjs(r.bookingDate, 'DD/MM/YYYY').isAfter(now)).length)]);
    rows.push([]);

    // Studio list
    rows.push([t('myStudios.title', 'My Studios')]);
    userStudios.forEach(studio => {
      rows.push([getLocalizedName(studio.name)]);
    });

    const csvContent = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quick_report_${now.format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [t, userStudios, reservations, getLocalizedName]);

  // Modal close handlers
  const handleQuickChargeClose = useCallback(() => {
    setIsQuickChargeOpen(false);
  }, []);

  const handleNewInvoiceClose = useCallback(() => {
    setIsNewInvoiceOpen(false);
  }, []);

  const handleBlockTimeClose = useCallback(() => {
    setBlockTimeStudioId(null);
  }, []);

  const handleManualBookingClose = useCallback(() => {
    setIsManualBookingOpen(false);
    setManualBookingStudioId(undefined);
  }, []);

  const handleManualBookingSuccess = useCallback(() => {
    setIsManualBookingOpen(false);
    setManualBookingStudioId(undefined);
  }, []);

  // Success handlers (can trigger refetch or toast if needed)
  const handleQuickChargeSuccess = useCallback(() => {
    setIsQuickChargeOpen(false);
  }, []);

  const handleNewInvoiceSuccess = useCallback(() => {
    setIsNewInvoiceOpen(false);
  }, []);

  return (
    <div className="dashboard-page">
      {/* Dashboard Title */}
      <h1 className="dashboard-page__title">{t('title', 'Dashboard')}</h1>

      {/* Quick Actions for Studio Owners */}
      {isStudioOwner && (
        <QuickActions 
          studios={userStudios}
          onQuickCharge={handleQuickCharge}
          onNewInvoice={handleNewInvoice}
          onNewReservation={handleNewReservation}
          onBlockTime={handleBlockTime}
          onDownloadReport={handleDownloadReport}
        />
      )}

      {/* Tab Navigation for Studio Owners */}
      {isStudioOwner && (
        <div className="dashboard-page__views">
          <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'studios' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('studios')}
          >
            {t('tabs.manageStudios', 'Manage Studios')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'overview' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('tabs.overview', 'Activity Log')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'stats' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            {t('tabs.stats', 'Statistics')}
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'documents' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            {t('tabs.documents', 'Documents')}
          </button>
        </div>
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
                limit={3}
              />
            )}
            <DashboardCalendar
              studios={userStudios}
              reservations={reservations}
              isStudioOwner={isStudioOwner}
              onNewReservation={() => handleNewReservation()}
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

      {/* Quick Action Modals */}
      <QuickChargeModal
        open={isQuickChargeOpen}
        onClose={handleQuickChargeClose}
        onSuccess={handleQuickChargeSuccess}
        studioName={getLocalizedName(userStudios[0]?.name)}
      />

      <NewInvoiceModal
        open={isNewInvoiceOpen}
        onClose={handleNewInvoiceClose}
        onSuccess={handleNewInvoiceSuccess}
        studioName={getLocalizedName(userStudios[0]?.name)}
      />

      {blockTimeStudio && (
        <StudioBlockModal
          studioId={blockTimeStudio._id}
          studioAvailability={blockTimeStudio.studioAvailability}
          open={!!blockTimeStudioId}
          onClose={handleBlockTimeClose}
        />
      )}

      <ManualBookingModal
        open={isManualBookingOpen}
        onClose={handleManualBookingClose}
        onSuccess={handleManualBookingSuccess}
        studios={userStudios}
        preselectedStudioId={manualBookingStudioId}
      />
    </div>
  );
};

export default DashboardPage;

