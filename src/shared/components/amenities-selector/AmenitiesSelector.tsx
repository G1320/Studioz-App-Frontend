import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAmenities } from '@shared/hooks';
// Icons
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MicIcon from '@mui/icons-material/Mic';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideocamIcon from '@mui/icons-material/Videocam';
import WeekendIcon from '@mui/icons-material/Weekend';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import TvIcon from '@mui/icons-material/Tv';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import AccessibleIcon from '@mui/icons-material/Accessible';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './styles/_amenities-selector.scss';

// Map amenity keys to icons
const amenityIcons: Record<string, React.ElementType> = {
  air_conditioning: AcUnitIcon,
  wifi: WifiIcon,
  kitchen: KitchenIcon,
  live_room: MicIcon,
  vocal_booth: RecordVoiceOverIcon,
  green_screen: VideocamIcon,
  lounge_area: WeekendIcon,
  natural_light: WbSunnyIcon,
  acoustic_treatment: GraphicEqIcon,
  '24_7_access': AccessTimeIcon,
  private_parking: LocalParkingIcon,
  tv_monitor: TvIcon,
  changing_room: CheckroomIcon,
  smoking_allowed: SmokingRoomsIcon,
  wheelchair_accessible: AccessibleIcon
};

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  equipment?: string;
  onEquipmentChange?: (equipment: string) => void;
  errors?: string[];
}

export const AmenitiesSelector = ({
  selectedAmenities,
  onAmenitiesChange,
  equipment = '',
  onEquipmentChange,
  errors = []
}: AmenitiesSelectorProps) => {
  const { t } = useTranslation('forms');
  const { getAmenities, getEnglishByDisplay } = useAmenities();

  const amenities = useMemo(() => getAmenities(), [getAmenities]);

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

  // Get the key from the amenity value for icon lookup
  const getAmenityKey = (amenity: { key: string; value: string }) => {
    return amenity.key;
  };

  return (
    <div className="amenities-selector">
      {/* Amenities Section */}
      <div className="amenities-selector__section">
        <h2 className="amenities-selector__title">
          <WeekendIcon className="amenities-selector__title-icon" />
          {t('form.amenities.title', { defaultValue: 'Amenities' })}
        </h2>
        <p className="amenities-selector__helper">
          {t('form.amenities.helperText', { defaultValue: 'Select all amenities available at your studio.' })}
        </p>

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
      <div className="amenities-selector__section">
        <h2 className="amenities-selector__title">
          {t('form.equipment.title', { defaultValue: 'Equipment & Gear List' })}
        </h2>

        <div className="amenities-selector__textarea-container">
          <textarea
            className="amenities-selector__textarea"
            placeholder={t('form.equipment.placeholder', {
              defaultValue:
                'List your gear here (one item per line)...\ne.g.\nNeumann U87\nApollo Twin X\nFocal Alpha 65'
            })}
            value={equipment}
            onChange={(e) => onEquipmentChange?.(e.target.value)}
          />
          <div className="amenities-selector__textarea-icon">
            <InfoOutlinedIcon />
          </div>
        </div>
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
