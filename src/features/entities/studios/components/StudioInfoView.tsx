import { useMemo, useState } from 'react';
import { Studio } from 'src/types/index';
import { DayOfWeek } from 'src/types/studio';
import { useTranslation } from 'react-i18next';
import { useAmenities, useDays } from '@shared/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// MUI Icons
import WifiIcon from '@mui/icons-material/Wifi';
import CoffeeIcon from '@mui/icons-material/Coffee';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WeekendIcon from '@mui/icons-material/Weekend';
import AccessibleIcon from '@mui/icons-material/Accessible';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SpeakerIcon from '@mui/icons-material/Speaker';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideocamIcon from '@mui/icons-material/Videocam';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TuneIcon from '@mui/icons-material/Tune';
import PianoIcon from '@mui/icons-material/Piano';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ComputerIcon from '@mui/icons-material/Computer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: WifiIcon,
  air_conditioning: AcUnitIcon,
  waiting_area: WeekendIcon,
  kitchenette: KitchenIcon,
  tv_monitor: TvIcon,
  changing_room: CheckroomIcon,
  live_room: SpeakerIcon,
  vocal_booth: RecordVoiceOverIcon,
  video_production: VideocamIcon,
  natural_light: WbSunnyIcon,
  espresso_machine: CoffeeIcon,
  smoking_allowed: SmokingRoomsIcon,
  wheelchair_accessible: AccessibleIcon,
  private_parking: LocalParkingIcon
};

const EQUIPMENT_ICONS: Record<string, React.ElementType> = {
  microphones: MicIcon,
  preamps: TuneIcon,
  compressors: GraphicEqIcon,
  instruments: PianoIcon,
  monitoring: GraphicEqIcon,
  recording: HeadphonesIcon,
  software: ComputerIcon,
  other: MoreHorizIcon
};

interface StudioInfoViewProps {
  studio?: Studio;
}

export const StudioInfoView: React.FC<StudioInfoViewProps> = ({ studio }) => {
  const { t, i18n } = useTranslation('forms');
  const { t: tAmenities } = useTranslation('amenities');
  const { t: tEquipment } = useTranslation('equipment');
  const { getAmenities } = useAmenities();
  const { getDisplayByEnglish } = useDays();
  const amenitiesConfig = useMemo(() => getAmenities(), [getAmenities]);

  const [showAllHours, setShowAllHours] = useState(false);
  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  const getCleanAddress = (address: string, city?: string) => {
    const raw = [address, city].filter(Boolean).join(', ');
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    // Deduplicate while preserving order (removes repeated city etc.)
    const seen = new Set<string>();
    const unique = parts.filter((p) => {
      const key = p.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.join(', ');
  };

  // Map amenity values to display labels and icons
  const amenitiesDisplay = useMemo(() => {
    if (!studio?.amenities) return [];
    return studio.amenities.map((amenity) => {
      const config = amenitiesConfig.find((a) => a.value === amenity);
      const key = amenity.toLowerCase().replace(/\s+/g, '_');
      return {
        key,
        label: config?.value || tAmenities(key, { defaultValue: amenity }),
        icon: AMENITY_ICONS[key] || AutoAwesomeIcon
      };
    });
  }, [studio?.amenities, amenitiesConfig, tAmenities]);

  // Parse equipment categories
  const equipmentCategories = useMemo(() => {
    if (!studio?.equipment || studio.equipment.length === 0) return [];
    return studio.equipment
      .filter((cat) => cat.items) // Filter out categories with no items
      .map((cat) => ({
        category: cat.category,
        label: tEquipment(`categories.${cat.category}`, { defaultValue: cat.category }),
        icon: EQUIPMENT_ICONS[cat.category] || MoreHorizIcon,
        items: cat.items
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      }));
  }, [studio?.equipment, tEquipment]);

  // Parse house rules
  const houseRules = useMemo(() => {
    const rulesText = studio?.cancellationPolicy?.houseRules?.[currentLang] || '';
    if (!rulesText) return [];
    return rulesText
      .split('\n')
      .map((rule) => rule.trim())
      .filter((rule) => rule.length > 0);
  }, [studio?.cancellationPolicy?.houseRules, currentLang]);

  // Format availability for display
  const formattedAvailability = useMemo(() => {
    if (!studio?.studioAvailability?.days?.length || !studio?.studioAvailability?.times?.length) {
      return [];
    }

    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const { days, times } = studio.studioAvailability;

    return allDays.map((day) => {
      const index = days.indexOf(day);
      if (index === -1) {
        return {
          day,
          displayDay: getDisplayByEnglish(day),
          hours: i18n.language === 'he' ? 'סגור' : 'Closed',
          isClosed: true
        };
      }
      const timeSlot = times[index];
      const hours =
        i18n.language === 'he' ? `${timeSlot?.end} - ${timeSlot?.start}` : `${timeSlot?.start} - ${timeSlot?.end}`;
      return {
        day,
        displayDay: getDisplayByEnglish(day),
        hours,
        isClosed: false
      };
    });
  }, [studio?.studioAvailability, getDisplayByEnglish, i18n.language]);

  const hasAvailability = formattedAvailability.length > 0;
  const visibleHours = showAllHours ? formattedAvailability : formattedAvailability.slice(0, 5);
  const hasMoreHours = formattedAvailability.length > 5;

  return (
    <div className="studio-info-view">
      {/* Amenities Grid */}
      {amenitiesDisplay.length > 0 && (
        <section className="info-section">
          <h3 className="info-section__title">
            <AutoAwesomeIcon className="info-section__icon" />
            {t('form.studioDetails.amenities', { defaultValue: 'Amenities & Features' })}
          </h3>
          <div className="info-section__grid info-section__grid--amenities">
            {amenitiesDisplay.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div key={amenity.key} className="amenity-card">
                  <div className="amenity-card__icon">
                    <IconComponent />
                  </div>
                  <span className="amenity-card__label">{amenity.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Equipment/Gear List */}
      {equipmentCategories.length > 0 && (
        <section className="info-section">
          <h3 className="info-section__title">
            <MicIcon className="info-section__icon" />
            {t('form.studioDetails.equipment', { defaultValue: 'Studio Gear' })}
          </h3>
          <div className="info-section__grid info-section__grid--equipment">
            {equipmentCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.category} className="equipment-category-card">
                  <div className="equipment-category-card__header">
                    <IconComponent className="equipment-category-card__icon" />
                    <h4 className="equipment-category-card__title">{category.label}</h4>
                  </div>
                  <ul className="equipment-category-card__list">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="equipment-category-card__item">
                        <span className="equipment-category-card__bullet" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Info Cards Row */}
      <div className="info-section__row">
        {/* Contact & Location */}
        {(studio?.address || studio?.phone || studio?.website) && (
          <section className="info-card info-card--contact">
            <h3 className="info-card__title">
              <LocationOnIcon className="info-card__icon" />
              {t('form.studioDetails.contactLocation', { defaultValue: 'Contact & Location' })}
            </h3>
            <div className="info-card__contact-list">
              {studio?.address && (
                <div className="info-card__contact-item">
                  <div className="info-card__contact-icon">
                    <LocationOnIcon />
                  </div>
                  <div className="info-card__contact-content">
                    <span className="info-card__contact-label">
                      {t('form.studioDetails.address', { defaultValue: 'Address' })}
                    </span>
                    <span className="info-card__contact-value">
                      {getCleanAddress(studio.address, studio.city)}
                    </span>
                  </div>
                </div>
              )}
              {studio?.phone && (
                <div className="info-card__contact-item">
                  <div className="info-card__contact-icon">
                    <PhoneIcon />
                  </div>
                  <div className="info-card__contact-content">
                    <span className="info-card__contact-label">
                      {t('form.studioDetails.phone', { defaultValue: 'Phone' })}
                    </span>
                    <a href={`tel:${studio.phone}`} className="info-card__contact-value info-card__contact-value--link">
                      {studio.phone}
                    </a>
                  </div>
                </div>
              )}
              {studio?.website && (
                <div className="info-card__contact-item">
                  <div className="info-card__contact-icon">
                    <LanguageIcon />
                  </div>
                  <div className="info-card__contact-content">
                    <span className="info-card__contact-label">
                      {t('form.studioDetails.website', { defaultValue: 'Website' })}
                    </span>
                    <a
                      href={studio.website.startsWith('http') ? studio.website : `https://${studio.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-card__contact-value info-card__contact-value--link"
                    >
                      {(() => {
                        try {
                          const url = new URL(
                            studio.website.startsWith('http') ? studio.website : `https://${studio.website}`
                          );
                          return url.hostname;
                        } catch {
                          return studio.website.replace(/^https?:\/\//, '');
                        }
                      })()}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Rules & Policies */}
        {houseRules.length > 0 && (
          <section className="info-card">
            <h3 className="info-card__title">
              <SecurityIcon className="info-card__icon" />
              {t('form.studioDetails.houseRules', { defaultValue: 'House Rules' })}
            </h3>
            <ul className="info-card__list">
              {houseRules.map((rule, idx) => (
                <li key={idx} className="info-card__list-item">
                  <InfoOutlinedIcon className="info-card__list-icon" />
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasAvailability && (
          <section className="info-card">
            <h3 className="info-card__title">
              <AccessTimeIcon className="info-card__icon" />
              {t('form.studioDetails.openingHours', { defaultValue: 'Opening Hours' })}
            </h3>
            <div className="info-card__hours">
              {visibleHours.map((slot) => (
                <div
                  key={slot.day}
                  className={`info-card__hours-row ${slot.isClosed ? 'info-card__hours-row--closed' : ''}`}
                >
                  <span className="info-card__hours-days">{slot.displayDay}</span>
                  <span className="info-card__hours-time">{slot.hours}</span>
                </div>
              ))}
              {hasMoreHours && (
                <button className="info-card__hours-toggle" onClick={() => setShowAllHours(!showAllHours)}>
                  {showAllHours ? (
                    <>
                      <ExpandLessIcon className="info-card__hours-toggle-icon" />
                      {i18n.language === 'he' ? 'הצג פחות' : 'Show less'}
                    </>
                  ) : (
                    <>
                      <ExpandMoreIcon className="info-card__hours-toggle-icon" />
                      {i18n.language === 'he' ? 'הצג הכל' : 'Show all'}
                    </>
                  )}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
