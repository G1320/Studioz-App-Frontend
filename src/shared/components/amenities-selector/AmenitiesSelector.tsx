import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAmenities } from '@shared/hooks';
import {
  WifiIcon,
  AcIcon,
  KitchenIcon,
  CoffeeIcon,
  SpeakerIcon,
  RecordIcon,
  VideocamIcon,
  WeekendIcon,
  SunnyIcon,
  GraphicEqIcon,
  ClockIcon,
  TvIcon,
  CheckroomIcon,
  SmokingRoomsIcon,
  AccessibleIcon,
  MicIcon,
  TuneIcon,
  CompressIcon,
  PianoIcon,
  AlbumIcon,
  ComputerIcon,
  MoreHorizIcon,
  AddIcon,
  DeleteIcon,
  BuildIcon
} from '@shared/components/icons';
import './styles/_amenities-selector.scss';

// Map amenity keys to icons
const amenityIcons: Record<string, React.ElementType> = {
  air_conditioning: AcIcon,
  wifi: WifiIcon,
  kitchen: KitchenIcon,
  espresso_machine: CoffeeIcon,
  live_room: SpeakerIcon,
  vocal_booth: RecordIcon,
  green_screen: VideocamIcon,
  lounge_area: WeekendIcon,
  natural_light: SunnyIcon,
  acoustic_treatment: GraphicEqIcon,
  '24_7_access': ClockIcon,
  tv_monitor: TvIcon,
  changing_room: CheckroomIcon,
  smoking_allowed: SmokingRoomsIcon,
  wheelchair_accessible: AccessibleIcon
};

// Equipment category icons
const equipmentCategoryIcons: Record<string, React.ElementType> = {
  microphones: MicIcon,
  preamps: TuneIcon,
  compressors: CompressIcon,
  instruments: PianoIcon,
  monitoring: SpeakerIcon,
  recording: AlbumIcon,
  software: ComputerIcon,
  other: MoreHorizIcon
};

// Equipment categories list
const EQUIPMENT_CATEGORIES = [
  'microphones',
  'preamps',
  'compressors',
  'instruments',
  'monitoring',
  'recording',
  'software',
  'other'
] as const;

type EquipmentCategoryId = (typeof EQUIPMENT_CATEGORIES)[number];

export interface CategorizedEquipment {
  [categoryId: string]: string; // Raw text input - items separated by newlines or commas
}

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  equipment?: CategorizedEquipment;
  onEquipmentChange?: (equipment: CategorizedEquipment) => void;
  errors?: string[];
}

export const AmenitiesSelector = ({
  selectedAmenities,
  onAmenitiesChange,
  equipment = {},
  onEquipmentChange,
  errors = []
}: AmenitiesSelectorProps) => {
  const { t } = useTranslation('forms');
  const { getAmenities, getEnglishByDisplay } = useAmenities();

  const amenities = useMemo(() => getAmenities(), [getAmenities]);

  // Track which categories are currently visible/added
  const [visibleCategories, setVisibleCategories] = useState<EquipmentCategoryId[]>(() => {
    const existing = Object.keys(equipment).filter(
      (cat) => equipment[cat]?.trim().length > 0
    ) as EquipmentCategoryId[];
    return existing.length > 0 ? existing : [];
  });

  const toggleAmenity = (amenityDisplay: string) => {
    const englishValue = getEnglishByDisplay(amenityDisplay);
    const isSelected = selectedAmenities.includes(englishValue);

    if (isSelected) {
      onAmenitiesChange(selectedAmenities.filter((a) => a !== englishValue));
    } else {
      onAmenitiesChange([...selectedAmenities, englishValue]);
    }
  };

  const isAmenitySelected = (amenityDisplay: string) => {
    const englishValue = getEnglishByDisplay(amenityDisplay);
    return selectedAmenities.includes(englishValue);
  };

  const getAmenityKey = (amenity: { key: string; value: string }) => {
    return amenity.key;
  };

  const handleCategoryEquipmentChange = (categoryId: EquipmentCategoryId, value: string) => {
    const newEquipment = { ...equipment };
    if (value.trim().length > 0) {
      newEquipment[categoryId] = value;
    } else {
      delete newEquipment[categoryId];
    }
    onEquipmentChange?.(newEquipment);
  };

  const addCategory = (categoryId: EquipmentCategoryId) => {
    if (!visibleCategories.includes(categoryId)) {
      setVisibleCategories([...visibleCategories, categoryId]);
    }
  };

  const removeCategory = (categoryId: EquipmentCategoryId) => {
    setVisibleCategories(visibleCategories.filter((c) => c !== categoryId));
    // Also remove the equipment from this category
    const newEquipment = { ...equipment };
    delete newEquipment[categoryId];
    onEquipmentChange?.(newEquipment);
  };

  const availableCategories = EQUIPMENT_CATEGORIES.filter((cat) => !visibleCategories.includes(cat));

  return (
    <div className="amenities-selector">
      {/* Amenities Section */}
      <div className="amenities-selector__section">
        <div className="amenities-selector__grid">
          {amenities.map((amenity) => {
            const isSelected = isAmenitySelected(amenity.value);
            const IconComponent = amenityIcons[getAmenityKey(amenity)] || WeekendIcon;

            return (
              <button
                key={amenity.key}
                type="button"
                onClick={() => toggleAmenity(amenity.value)}
                className={`amenities-selector__item ${isSelected ? 'amenities-selector__item--selected' : ''}`}
              >
                <IconComponent className="amenities-selector__item-icon" />
                <span className="amenities-selector__item-label">{amenity.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment & Gear Section */}
      <div className="amenities-selector__section amenities-selector__equipment-section">
        <h2 className="amenities-selector__title">
          <BuildIcon className="amenities-selector__title-icon" />
          {t('form.equipment.title', { defaultValue: 'Equipment & Gear List' })}
        </h2>

        {/* Equipment Categories */}
        <div className="equipment-categories">
          {visibleCategories.map((categoryId) => {
            const IconComponent = equipmentCategoryIcons[categoryId] || MoreHorizIcon;
            const categoryValue = equipment[categoryId] || '';

            return (
              <div key={categoryId} className="equipment-category">
                <div className="equipment-category__header">
                  <div className="equipment-category__title-row">
                    <IconComponent className="equipment-category__icon" />
                    <span className="equipment-category__title">
                      {t(`form.equipment.categories.${categoryId}`, { defaultValue: categoryId })}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="equipment-category__remove"
                    onClick={() => removeCategory(categoryId)}
                    aria-label={t('common:remove', { defaultValue: 'Remove' })}
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <textarea
                  className="equipment-category__textarea"
                  placeholder={t('form.equipment.placeholder', { defaultValue: 'One item per line...' })}
                  value={categoryValue}
                  onChange={(e) => handleCategoryEquipmentChange(categoryId, e.target.value)}
                  rows={3}
                />
              </div>
            );
          })}
        </div>

        {/* Add Category Button */}
        {availableCategories.length > 0 && (
          <div className="equipment-add-category">
            <select
              className="equipment-add-category__select"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addCategory(e.target.value as EquipmentCategoryId);
                }
              }}
            >
              <option value="">{t('form.equipment.addCategory', { defaultValue: 'Add Category' })}...</option>
              {availableCategories.map((categoryId) => (
                <option key={categoryId} value={categoryId}>
                  {t(`form.equipment.categories.${categoryId}`, { defaultValue: categoryId })}
                </option>
              ))}
            </select>
            <AddIcon className="equipment-add-category__icon" />
          </div>
        )}

        <p className="amenities-selector__helper">
          {t('form.equipment.helperText', {
            defaultValue: 'Being detailed about your gear helps musicians find exactly what they need.'
          })}
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="amenities-selector__errors">
          {errors.map((error, index) => (
            <div key={index} className="amenities-selector__error">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmenitiesSelector;
