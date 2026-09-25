import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AmenitiesSelector, CategorizedEquipment } from '@shared/components/amenities-selector';
import { Studio } from 'src/types/index';
import { EquipmentCategory } from 'src/types/studio';
import { useStudioSectionSave } from '../useStudioSectionSave';
import { SectionChrome } from './SectionChrome';

interface AmenitiesSectionProps {
  studio: Studio;
}

function equipmentToRecord(equipment?: EquipmentCategory[] | string[]): CategorizedEquipment {
  if (!equipment?.length) return {};
  if (typeof equipment[0] === 'string') {
    return { other: (equipment as string[]).join('\n') };
  }
  return (equipment as EquipmentCategory[]).reduce((acc, cat) => {
    acc[cat.category] = cat.items;
    return acc;
  }, {} as CategorizedEquipment);
}

function recordToEquipment(list: CategorizedEquipment): EquipmentCategory[] {
  return Object.entries(list)
    .filter(([, items]) => items.trim().length > 0)
    .map(([category, items]) => ({ category, items }));
}

export const AmenitiesSection = ({ studio }: AmenitiesSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);

  const baselineAmenities = studio.amenities || [];
  const baselineEquipment = useMemo(
    () => equipmentToRecord(studio.equipment as EquipmentCategory[] | string[] | undefined),
    [studio.equipment]
  );

  const [amenities, setAmenities] = useState<string[]>(baselineAmenities);
  const [equipment, setEquipment] = useState<CategorizedEquipment>(baselineEquipment);

  useEffect(() => {
    setAmenities(studio.amenities || []);
    setEquipment(equipmentToRecord(studio.equipment as EquipmentCategory[] | string[] | undefined));
  }, [studio._id, studio.amenities, studio.equipment]);

  const isDirty =
    JSON.stringify([...amenities].sort()) !== JSON.stringify([...baselineAmenities].sort()) ||
    JSON.stringify(equipment) !== JSON.stringify(baselineEquipment);

  const handleDiscard = () => {
    setAmenities(baselineAmenities);
    setEquipment(baselineEquipment);
  };

  const handleSave = () => {
    savePatch({
      amenities,
      equipment: recordToEquipment(equipment)
    });
  };

  return (
    <SectionChrome
      title={t('manage.sections.amenities', 'Amenities & gear')}
      subtitle={t('manage.amenities.subtitle', 'What guests can expect on site.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body studio-manage-panel__body--embed">
          <AmenitiesSelector
            selectedAmenities={amenities}
            onAmenitiesChange={setAmenities}
            equipment={equipment}
            onEquipmentChange={setEquipment}
          />
        </div>
      </div>
    </SectionChrome>
  );
};
