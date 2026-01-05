import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMusicSubCategories, useCategories, useCities, useAmenities } from '@shared/hooks/utils';
import { cities } from '@core/config/cities/cities';
import { Studio } from 'src/types/index';
import { filterStudios } from '../utils/filterStudios';

// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import RadioIcon from '@mui/icons-material/Radio';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CoffeeIcon from '@mui/icons-material/Coffee';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PeopleIcon from '@mui/icons-material/People';

import '../styles/_sidebar-filters.scss';

// Types
export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  amenities: string[];
  minSize: number | '';
  minCapacity: number | '';
  location: string;
}

export interface SidebarFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  studios?: Studio[];
  className?: string;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  music: MusicNoteIcon,
  podcast: MicIcon,
  photo: CameraAltIcon,
  video: VideocamIcon,
  rehearsal: RadioIcon,
  recording: MusicNoteIcon,
  production: MusicNoteIcon,
  mixing: MusicNoteIcon,
  mastering: MusicNoteIcon
};

// Amenity icons mapping
const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: WifiIcon,
  parking: LocalParkingIcon,
  private_parking: LocalParkingIcon,
  air_conditioning: AcUnitIcon,
  ac: AcUnitIcon,
  lounge: CoffeeIcon,
  waiting_area: CoffeeIcon,
  espresso_machine: CoffeeIcon,
  accessible: AccessibleIcon,
  wheelchair_accessible: AccessibleIcon,
  '247': AccessTimeIcon
};

const MAX_PRICE = 1000;

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  isOpen = true,
  onClose,
  onApply,
  initialFilters,
  studios = [],
  className = ''
}) => {
  const { t, i18n } = useTranslation('studios');
  const { t: tCommon } = useTranslation('common');
  const isRTL = i18n.dir() === 'rtl';
  const musicSubCategories = useMusicSubCategories();
  const { getEnglishByDisplay } = useCategories();
  const { getDisplayByCityName } = useCities();
  const { getAmenities } = useAmenities();

  const amenitiesList = useMemo(() => getAmenities(), [getAmenities]);

  // State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    amenities: [],
    minSize: '',
    minCapacity: '',
    location: '',
    ...initialFilters
  });

  // Calculate filtered count in real-time based on current filter selections
  const filteredCount = useMemo(() => {
    const filtered = filterStudios(studios, {
      subcategory: filters.categories.length > 0 ? filters.categories[0] : undefined,
      city: filters.location || undefined
    });
    return filtered.length;
  }, [studios, filters.categories, filters.location]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    amenities: false,
    specs: true,
    location: false
  });

  // Handlers
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id) ? prev.categories.filter((c) => c !== id) : [...prev.categories, id]
    }));
  };

  const handleAmenityToggle = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      amenities: [],
      minSize: '',
      minCapacity: '',
      location: ''
    });
  };

  const activeFilterCount = filters.categories.length + filters.amenities.length + (filters.location ? 1 : 0);

  // Get category icon
  const getCategoryIcon = (category: string): React.ElementType => {
    const lower = category.toLowerCase();
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
      if (lower.includes(key)) return icon;
    }
    return MusicNoteIcon;
  };

  // Get amenity icon
  const getAmenityIcon = (amenityKey: string): React.ElementType => {
    const key = amenityKey.toLowerCase().replace(/\s+/g, '_');
    return AMENITY_ICONS[key] || WifiIcon;
  };

  if (!isOpen) return null;

  return (
    <aside className={`sidebar-filters ${className}`} dir={i18n.dir()}>
      {/* Header */}
      <div className="sidebar-filters__header">
        <h2 className="sidebar-filters__title">
          {t('filters.title', { defaultValue: 'Filters' })}
          {activeFilterCount > 0 && (
            <span className="sidebar-filters__count">
              {activeFilterCount} {t('filters.active', { defaultValue: 'Active' })}
            </span>
          )}
        </h2>
        <div className="sidebar-filters__actions">
          <button
            onClick={resetFilters}
            className="sidebar-filters__reset"
            title={t('filters.reset', { defaultValue: 'Reset' })}
          >
            <RestartAltIcon />
          </button>
          {onClose && (
            <button onClick={onClose} className="sidebar-filters__close">
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="sidebar-filters__content">
        {/* Categories Section */}
        <div className="sidebar-filters__section">
          <button onClick={() => toggleSection('categories')} className="sidebar-filters__section-header">
            <h3 className="sidebar-filters__section-title">
              {t('filters.studioType', { defaultValue: 'Studio Type' })}
            </h3>
            {expandedSections.categories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {expandedSections.categories && (
            <div className="sidebar-filters__categories">
              {musicSubCategories.slice(0, 6).map((category) => {
                const englishCat = getEnglishByDisplay(category);
                const isSelected = filters.categories.includes(englishCat);
                const IconComponent = getCategoryIcon(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(englishCat)}
                    className={`sidebar-filters__category-btn ${isSelected ? 'sidebar-filters__category-btn--active' : ''}`}
                  >
                    <IconComponent />
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="sidebar-filters__divider" />

        {/* Price Range Section */}
        <div className="sidebar-filters__section">
          <button onClick={() => toggleSection('price')} className="sidebar-filters__section-header">
            <h3 className="sidebar-filters__section-title">
              {t('filters.priceRange', { defaultValue: 'Price Range' })}
            </h3>
            {expandedSections.price ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {expandedSections.price && (
            <div className="sidebar-filters__price">
              <div className="sidebar-filters__price-labels">
                <span>₪0</span>
                <span className="sidebar-filters__price-current">₪{filters.priceRange[1]}</span>
                <span className="sidebar-filters__price-max">
                  {t('filters.max', { defaultValue: 'Max' })} ₪{MAX_PRICE}
                </span>
              </div>
              <div className="sidebar-filters__price-slider">
                <div
                  className="sidebar-filters__price-fill"
                  style={
                    isRTL
                      ? { width: `${(filters.priceRange[1] / MAX_PRICE) * 100}%`, right: 0, left: 'auto' }
                      : { width: `${(filters.priceRange[1] / MAX_PRICE) * 100}%` }
                  }
                />
                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="sidebar-filters__price-input"
                  style={isRTL ? { direction: 'rtl' } : undefined}
                />
                <div
                  className="sidebar-filters__price-thumb"
                  style={
                    isRTL
                      ? { right: `calc(${(filters.priceRange[1] / MAX_PRICE) * 100}% - 10px)`, left: 'auto' }
                      : { left: `calc(${(filters.priceRange[1] / MAX_PRICE) * 100}% - 10px)` }
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-filters__divider" />

        {/* Location Section */}
        <div className="sidebar-filters__section">
          <button onClick={() => toggleSection('location')} className="sidebar-filters__section-header">
            <h3 className="sidebar-filters__section-title">{t('filters.location', { defaultValue: 'Location' })}</h3>
            {expandedSections.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {expandedSections.location && (
            <div className="sidebar-filters__location">
              <div className="sidebar-filters__select-wrapper">
                <LocationOnIcon className="sidebar-filters__select-icon" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                  className="sidebar-filters__select"
                >
                  <option value="">{t('filters.anyLocation', { defaultValue: 'Any Location' })}</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {getDisplayByCityName(city.name)}
                    </option>
                  ))}
                </select>
                <ExpandMoreIcon className="sidebar-filters__select-arrow" />
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-filters__divider" />

        {/* Specs Section */}
        <div className="sidebar-filters__section">
          <button onClick={() => toggleSection('specs')} className="sidebar-filters__section-header">
            <h3 className="sidebar-filters__section-title">{t('filters.specs', { defaultValue: 'Specs' })}</h3>
            {expandedSections.specs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {expandedSections.specs && (
            <div className="sidebar-filters__specs">
              <div className="sidebar-filters__spec-field">
                <label>{t('filters.minSize', { defaultValue: 'Min Size (m²)' })}</label>
                <div className="sidebar-filters__input-wrapper">
                  <SquareFootIcon className="sidebar-filters__input-icon" />
                  <input
                    type="number"
                    placeholder={tCommon('any', { defaultValue: 'Any' })}
                    value={filters.minSize}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, minSize: e.target.value ? parseInt(e.target.value) : '' }))
                    }
                    className="sidebar-filters__input"
                  />
                </div>
              </div>
              <div className="sidebar-filters__spec-field">
                <label>{t('filters.minCapacity', { defaultValue: 'Min Capacity' })}</label>
                <div className="sidebar-filters__input-wrapper">
                  <PeopleIcon className="sidebar-filters__input-icon" />
                  <input
                    type="number"
                    placeholder={tCommon('any', { defaultValue: 'Any' })}
                    value={filters.minCapacity}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, minCapacity: e.target.value ? parseInt(e.target.value) : '' }))
                    }
                    className="sidebar-filters__input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-filters__divider" />

        {/* Amenities Section */}
        <div className="sidebar-filters__section">
          <button onClick={() => toggleSection('amenities')} className="sidebar-filters__section-header">
            <h3 className="sidebar-filters__section-title">{t('filters.amenities', { defaultValue: 'Amenities' })}</h3>
            {expandedSections.amenities ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {expandedSections.amenities && (
            <div className="sidebar-filters__amenities">
              {amenitiesList.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity.key);
                const IconComponent = getAmenityIcon(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => handleAmenityToggle(amenity.key)}
                    className="sidebar-filters__amenity-btn"
                  >
                    <div className="sidebar-filters__amenity-info">
                      <div
                        className={`sidebar-filters__amenity-icon ${isSelected ? 'sidebar-filters__amenity-icon--active' : ''}`}
                      >
                        <IconComponent />
                      </div>
                      <span className={isSelected ? 'sidebar-filters__amenity-label--active' : ''}>
                        {amenity.value}
                      </span>
                    </div>
                    <div
                      className={`sidebar-filters__checkbox ${isSelected ? 'sidebar-filters__checkbox--checked' : ''}`}
                    >
                      {isSelected && <CheckIcon />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-filters__footer">
        <button onClick={() => onApply?.(filters)} className="sidebar-filters__apply-btn">
          {t('filters.showStudios', { defaultValue: 'Show {{count}} Studios', count: filteredCount })}
        </button>
      </div>
    </aside>
  );
};

export default SidebarFilters;
