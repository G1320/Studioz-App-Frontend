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
  }, [studio._id]);

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
            {t('manage.hours.subtitle', 'Weekly schedule customers can book against.')}
          </p>
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
          >
            {t('common:buttons.discard', 'Discard')}
          </button>
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving
              ? t('common:buttons.saving', 'Saving…')
              : t('common:buttons.save', 'Save')}
          </button>
        </div>
      </header>

      <BusinessHours key={hoursKey} value={availability} onChange={setAvailability} />
    </div>
  );
};
