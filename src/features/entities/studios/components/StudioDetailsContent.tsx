import { useState } from 'react';
import { Studio } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { StudioOverviewView } from './StudioOverviewView';
import { StudioInfoView } from './StudioInfoView';

// MUI Icons
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';

type ContentView = 'overview' | 'info';

interface StudioDetailsContentProps {
  studio?: Studio;
}

export const StudioDetailsContent: React.FC<StudioDetailsContentProps> = ({ studio }) => {
  const { t } = useTranslation('common');
  const [activeView, setActiveView] = useState<ContentView>('overview');

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
      </div>

      {/* Content Views */}
      <div className="view-content">
        {activeView === 'overview' && <StudioOverviewView studio={studio} />}
        {activeView === 'info' && <StudioInfoView studio={studio} />}
      </div>
    </div>
  );
};
