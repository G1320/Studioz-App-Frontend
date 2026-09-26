import '../styles/_index.scss';
import React, { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { User, Studio } from 'src/types/index';
import { useReservations, useLanguageNavigate } from '@shared/hooks';
import { ViewTabs, PageHeader } from '@shared/components';
import { DashboardCalendar, RecentActivity, QuickActions, ManualBookingModal } from '../components';
import { StudioManager, StudioBlockModal } from '@features/entities/studios';
import { QuickChargeModal } from '@features/entities/merchant-documents';
import { BusinessIcon, ArrowForwardIcon, DashboardIcon, AddIcon } from '@shared/components/icons';

import MerchantDocumentsPage from '@features/entities/merchant-documents/pages/MerchantDocumentsPage';
import BillingPage from '@features/entities/billing/pages/BillingPage';

// Subtle fade transition for view switching
const viewTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

type DashboardTab = 'overview' | 'activity' | 'studios' | 'documents' | 'billing';

const VALID_TABS: DashboardTab[] = ['overview', 'activity', 'studios', 'documents', 'billing'];

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
  const langNavigate = useLanguageNavigate();

  // Modal states
  const [isQuickChargeOpen, setIsQuickChargeOpen] = useState(false);
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

  // Show first-studio empty state for any logged-in user who is not yet an owner.
  const showEmptyState = Boolean(user?._id) && !isStudioOwner;
  const hasActiveStudio = userStudios.some((studio) => studio.active !== false);
  const hasActiveService = userStudios.some((studio) => studio.active !== false && (studio.items?.some((item) => item.active !== false) ?? false));
  const hasPaymentSetup = Boolean(user?.sumitCompanyId);
  const showGoLiveChecklist = isStudioOwner && (!hasPaymentSetup || !hasActiveStudio || !hasActiveService);

  // Legacy tab deep-link — stats now lives at /stats
  if (searchParams.get('tab') === 'stats') {
    return <Navigate to={`/${i18n.language}/stats`} replace />;
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        icon={<DashboardIcon />}
        title={t('title', 'Dashboard')}
      >
        {isStudioOwner && activeTab === 'studios' ? (
          <button
            type="button"
            className="page-header__cta"
            onClick={() => langNavigate('/studio/create')}
          >
            <AddIcon />
            <span>{t('myStudios.addStudio', 'Add Studio')}</span>
          </button>
        ) : null}
      </PageHeader>

      {/* Empty State for subscribers without studios */}
      {showEmptyState && (
        <motion.div
          className="dashboard-empty-state"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="dashboard-empty-state__icon" aria-hidden="true">
            <BusinessIcon />
          </div>
          <div className="dashboard-empty-state__copy">
            <h2 className="dashboard-empty-state__title">
              {t('emptyState.title')}
            </h2>
            <p className="dashboard-empty-state__description">
              {t('emptyState.description')}
            </p>
          </div>
          <ol className="dashboard-empty-state__steps">
            <li>{t('emptyState.hints.profile')}</li>
            <li>{t('emptyState.hints.services')}</li>
            <li>{t('emptyState.hints.bookings')}</li>
          </ol>
          <div className="dashboard-empty-state__actions">
            <button
              type="button"
              className="dashboard-empty-state__cta"
              onClick={() => langNavigate('/studio/create')}
            >
              <BusinessIcon />
              {t('emptyState.createStudio')}
              <ArrowForwardIcon />
            </button>
            <button
              type="button"
              className="dashboard-empty-state__secondary"
              onClick={() => langNavigate('/preview/landing#studio-faq')}
            >
              {t('emptyState.secondaryCta')}
            </button>
          </div>
        </motion.div>
      )}

      {/* Launch readiness — single enterprise panel (no duplicate payment CTAs) */}
      {showGoLiveChecklist && (
        <section className="dashboard-page__setup" aria-labelledby="dashboard-setup-title">
          <header className="dashboard-page__setup-header">
            <div className="dashboard-page__setup-heading">
              <h2 id="dashboard-setup-title" className="dashboard-page__setup-title">
                {t('setupBanner.goLiveTitle', 'Before you go live')}
              </h2>
              <p className="dashboard-page__setup-subtitle">
                {hasPaymentSetup
                  ? t('setupBanner.goLiveSubtitleReady', 'Finish the remaining steps to publish and take bookings.')
                  : t(
                      'setupBanner.goLiveSubtitle',
                      'Studios can’t accept paid bookings until payment setup is complete.'
                    )}
              </p>
            </div>
            <p className="dashboard-page__setup-progress" aria-live="polite">
              {t('setupBanner.progress', {
                done: [hasActiveStudio, hasActiveService, hasPaymentSetup].filter(Boolean).length,
                total: 3,
                defaultValue: '{{done}} of {{total}} complete'
              })}
            </p>
          </header>

          <ul className="dashboard-page__setup-checklist">
            <li className={hasActiveStudio ? 'is-done' : undefined}>
              <span className="dashboard-page__setup-check" aria-hidden="true" />
              <span>{t('setupBanner.checklist.studio')}</span>
            </li>
            <li className={hasActiveService ? 'is-done' : undefined}>
              <span className="dashboard-page__setup-check" aria-hidden="true" />
              <span>{t('setupBanner.checklist.service')}</span>
            </li>
            <li className={hasPaymentSetup ? 'is-done' : undefined}>
              <span className="dashboard-page__setup-check" aria-hidden="true" />
              <span>{t('setupBanner.checklist.payment')}</span>
            </li>
          </ul>

          {!hasPaymentSetup && (
            <div className="dashboard-page__setup-actions">
              <button
                type="button"
                className="dashboard-page__setup-cta"
                onClick={() => langNavigate('/onboarding')}
              >
                {t('setupBanner.cta', 'Set up payments')}
                <ArrowForwardIcon />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Tab Navigation for Studio Owners */}
      {isStudioOwner && (
        <div className="dashboard-page__views">
          <ViewTabs
            tabs={[
              { key: 'studios', label: t('tabs.manageStudios', 'Manage Studios') },
              { key: 'overview', label: t('tabs.overview', 'Calendar') },
              { key: 'activity', label: t('tabs.activity', 'Activity') },
              { key: 'documents', label: t('tabs.documents', 'Documents') },
              { key: 'billing', label: t('tabs.billing', 'Billing') }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            aria-label={t('tabs.label', 'Dashboard views')}
          />
        </div>
      )}

      {/* Quick Actions — My Studio view only */}
      {isStudioOwner && activeTab === 'studios' && (
        <QuickActions 
          studios={userStudios}
          onQuickCharge={handleQuickCharge}
          onNewReservation={handleNewReservation}
          onBlockTime={handleBlockTime}
          onDownloadReport={handleDownloadReport}
        />
      )}

      {/* Tab Content with transition */}
      <AnimatePresence mode="sync" initial={false}>
        {activeTab === 'studios' && isStudioOwner && (
          <motion.div key="studios" {...viewTransition}>
            <StudioManager studios={userStudios} />
          </motion.div>
        )}

        {activeTab === 'activity' && isStudioOwner && (
          <motion.div key="activity" {...viewTransition}>
            <RecentActivity
              studioIds={userStudios.map((s) => s._id)}
              isStudioOwner={isStudioOwner}
              limit={5}
            />
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            className="dashboard-content"
            {...viewTransition}
          >
            <DashboardCalendar
              studios={userStudios}
              reservations={reservations}
              isStudioOwner={isStudioOwner}
              onNewReservation={() => handleNewReservation()}
            />
          </motion.div>
        )}

        {activeTab === 'documents' && isStudioOwner && (
          <motion.div key="documents" {...viewTransition}>
            <MerchantDocumentsPage />
          </motion.div>
        )}

        {activeTab === 'billing' && isStudioOwner && (
          <motion.div key="billing" {...viewTransition}>
            <BillingPage />
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

