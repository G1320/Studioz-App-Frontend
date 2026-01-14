import { useMemo, useCallback } from 'react';
import { Studio } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioOverviewView } from './StudioOverviewView';
import { StudioInfoView } from './StudioInfoView';
import { StudioPortfolioView } from './StudioPortfolioView';

import { GridViewIcon, ListIcon, WorkIcon } from '@shared/components/icons';

const viewVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

type ContentView = 'overview' | 'info' | 'portfolio';

const VALID_VIEWS: ContentView[] = ['overview', 'info', 'portfolio'];

interface StudioDetailsContentProps {
  studio?: Studio;
}

export const StudioDetailsContent: React.FC<StudioDetailsContentProps> = ({ studio }) => {
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();

  // Get view from URL, default to 'overview'
  const activeView = useMemo(() => {
    const viewParam = searchParams.get('view');
    return viewParam && VALID_VIEWS.includes(viewParam as ContentView) 
      ? (viewParam as ContentView) 
      : 'overview';
  }, [searchParams]);

  // Update URL when view changes
  const setActiveView = useCallback((view: ContentView) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (view === 'overview') {
        newParams.delete('view'); // Clean URL for default view
      } else {
        newParams.set('view', view);
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Check if studio has portfolio content to show the tab
  const hasPortfolio = useMemo(() => {
    const hasItems = studio?.portfolio && studio.portfolio.length > 0;
    const hasLinks = studio?.socialLinks && Object.values(studio.socialLinks).some((link) => link?.trim());
    return hasItems || hasLinks;
  }, [studio?.portfolio, studio?.socialLinks]);

  return (
    <div className="studio-details__content">
      {/* View Toggle */}
      <div className="view-toggle">
        <button
          onClick={() => setActiveView('overview')}
          className={`view-toggle__btn ${activeView === 'overview' ? 'view-toggle__btn--active' : ''}`}
        >
          <GridViewIcon className="view-toggle__icon" />
          {t('studioDetails.overview', { defaultValue: 'Overview' })}
        </button>
        <button
          onClick={() => setActiveView('info')}
          className={`view-toggle__btn ${activeView === 'info' ? 'view-toggle__btn--active' : ''}`}
        >
          <ListIcon className="view-toggle__icon" />
          {t('studioDetails.infoSpecs', { defaultValue: 'Info & Specs' })}
        </button>
        {hasPortfolio && (
          <button
            onClick={() => setActiveView('portfolio')}
            className={`view-toggle__btn ${activeView === 'portfolio' ? 'view-toggle__btn--active' : ''}`}
          >
            <WorkIcon className="view-toggle__icon" />
            {t('studioDetails.portfolio', { defaultValue: 'Portfolio' })}
          </button>
        )}
      </div>

      {/* Content Views */}
      <div className="view-content">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <StudioOverviewView studio={studio} />
            </motion.div>
          )}
          {activeView === 'info' && (
            <motion.div
              key="info"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <StudioInfoView studio={studio} />
            </motion.div>
          )}
          {activeView === 'portfolio' && (
            <motion.div
              key="portfolio"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <StudioPortfolioView 
                portfolio={studio?.portfolio} 
                socialLinks={studio?.socialLinks} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
