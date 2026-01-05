import { useState, useMemo } from 'react';
import { Studio } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { StudioOverviewView } from './StudioOverviewView';
import { StudioInfoView } from './StudioInfoView';
import { StudioPortfolioView } from './StudioPortfolioView';

// MUI Icons
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import WorkIcon from '@mui/icons-material/Work';

type ContentView = 'overview' | 'info' | 'portfolio';

interface StudioDetailsContentProps {
  studio?: Studio;
}

export const StudioDetailsContent: React.FC<StudioDetailsContentProps> = ({ studio }) => {
  const { t } = useTranslation('common');
  const [activeView, setActiveView] = useState<ContentView>('overview');

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
        {activeView === 'overview' && <StudioOverviewView studio={studio} />}
        {activeView === 'info' && <StudioInfoView studio={studio} />}
        {activeView === 'portfolio' && (
          <StudioPortfolioView 
            portfolio={studio?.portfolio} 
            socialLinks={studio?.socialLinks} 
          />
        )}
      </div>
    </div>
  );
};
