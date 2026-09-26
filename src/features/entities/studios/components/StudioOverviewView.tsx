import { Studio } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface StudioOverviewViewProps {
  studio?: Studio;
}

export const StudioOverviewView: React.FC<StudioOverviewViewProps> = ({ studio }) => {
  const { i18n } = useTranslation('forms');

  const currentLang = i18n.language === 'he' ? 'he' : 'en';
  const otherLang = currentLang === 'he' ? 'en' : 'he';
  // Prefer UI language; only fall back to the other lang if current is empty
  const description =
    studio?.description?.[currentLang]?.trim() ||
    studio?.description?.[otherLang]?.trim() ||
    '';

  return (
    <div className="studio-overview-view">
      <p className="studio-overview-view__description">{description}</p>
    </div>
  );
};
