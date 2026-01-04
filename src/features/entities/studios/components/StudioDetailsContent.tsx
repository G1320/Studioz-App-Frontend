import { useState } from 'react';
import { Studio } from 'src/types/index';
import { StudioOverviewView } from './StudioOverviewView';

type ContentView = 'overview' | 'info';

interface StudioDetailsContentProps {
  studio?: Studio;
}

export const StudioDetailsContent: React.FC<StudioDetailsContentProps> = ({ studio }) => {
  const [activeView] = useState<ContentView>('overview');

  return (
    <div className="studio-details__content">
      {activeView === 'overview' && <StudioOverviewView studio={studio} />}
      {activeView === 'info' && <div>Info view coming soon...</div>}
    </div>
  );
};
