import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessHours } from '@shared/components/forms/form-utils';
import { Studio } from 'src/types/index';
import { StudioAvailability } from 'src/types/studio';
import { useStudioSectionSave } from '../useStudioSectionSave';

interface HoursSectionProps {
  studio: Studio;
}

const emptyAvailability: StudioAvailability = {
  days: [],
  times: []
};

export const HoursSection = ({ studio }: HoursSectionProps) => {
  const { t } = useTranslation(['forms', 'common']);
  const [availability, setAvailability] = useState<StudioAvailability>(
    studio.studioAvailability || emptyAvailability
  );
  const [hoursKey, setHoursKey] = useState(0);
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);

  useEffect(() => {
    setAvailability(studio.studioAvailability || emptyAvailability);
    setHoursKey((k) => k + 1);
  }, [studio._id, JSON.stringify(studio.studioAvailability)]);

  const baseline = studio.studioAvailability || emptyAvailability;
  const isDirty = JSON.stringify(availability) !== JSON.stringify(baseline);

  const handleDiscard = () => {
    setAvailability(baseline);
    setHoursKey((k) => k + 1);
  };

  const handleSave = () => {
    savePatch({ studioAvailability: availability });
  };

  return (
    <div className="studio-manage-section">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t('manage.sections.hours', 'Hours')}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t('manage.hours.subtitle', 'Weekly bookable schedule.')}
          </p>
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--compact"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
          >
            {t('common:buttons.discard', 'Discard')}
          </button>
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary studio-manage-btn--compact"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving
              ? t('common:buttons.saving', 'Saving…')
              : t('common:buttons.save', 'Save')}
          </button>
        </div>
      </header>

      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body studio-manage-panel__body--hours">
          <div className="studio-manage-hours-legend" aria-hidden>
            <span>{t('manage.hours.dayCol', 'Day')}</span>
            <span>{t('manage.hours.scheduleCol', 'Schedule')}</span>
          </div>
          <BusinessHours key={hoursKey} value={availability} onChange={setAvailability} />
        </div>
      </div>
    </div>
  );
};
