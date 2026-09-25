import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks';
import { StudioManageSectionDef } from '../constants';

interface LegacySectionProps {
  studioId: string;
  section: StudioManageSectionDef;
}

export const LegacySectionBridge = ({ studioId, section }: LegacySectionProps) => {
  const { t } = useTranslation('forms');
  const langNavigate = useLanguageNavigate();

  const openLegacy = () => {
    if (section.id === 'services') {
      langNavigate('/dashboard');
      return;
    }
    const step = section.legacyStep ? `?step=${section.legacyStep}` : '';
    langNavigate(`/studio/${studioId}/edit${step}`);
  };

  return (
    <div className="studio-manage-section studio-manage-section--bridge">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t(section.labelKey, section.defaultLabel)}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t(
              'manage.bridge.subtitle',
              'This section is moving into the new editor next. Use the classic editor for now.'
            )}
          </p>
        </div>
      </header>
      <button type="button" className="studio-manage-btn studio-manage-btn--primary" onClick={openLegacy}>
        {section.id === 'services'
          ? t('manage.bridge.openDashboard', 'Open Studio Manager')
          : t('manage.bridge.openClassic', 'Open classic editor')}
      </button>
    </div>
  );
};
