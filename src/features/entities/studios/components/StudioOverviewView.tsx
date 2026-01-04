import { Studio } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface StudioOverviewViewProps {
  studio?: Studio;
}

export const StudioOverviewView: React.FC<StudioOverviewViewProps> = ({ studio }) => {
  const { i18n } = useTranslation('forms');

  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  return (
    <div className="studio-overview-view">
      <p className="description">{studio?.description[currentLang] || studio?.description.en}</p>
    </div>
  );
};
