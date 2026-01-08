import { useState, useEffect, Suspense, useMemo } from 'react';
import { StudioCard, StudiosList, SidebarFilters, FilterState } from '@features/entities';
import { LocationWelcomePopup, DistanceSlider } from '@shared/components';
import { LazyStudiosMap } from '@shared/components/maps';
import { GenericCarousel } from '@shared/components/carousels';
import { useCategories, useMusicSubCategories, useCities } from '@shared/hooks/utils';
import { useGeolocation } from '@shared/hooks/utils/geolocation';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Studio } from 'src/types/index';
import { cities } from '@core/config/cities/cities';
import { featureFlags } from '@core/config/featureFlags';
import { filterStudios } from '../utils/filterStudios';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Icons
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import TuneIcon from '@mui/icons-material/Tune';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getSubcategoryIcon, MusicProductionIcon } from '@shared/components/icons/CategoryIcons';

interface StudiosPageProps {
  studios: Studio[];
}

interface FilterChipProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, icon, isActive, onClick }) => (
  <button onClick={onClick} className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const StudiosPage: React.FC<StudiosPageProps> = ({ studios }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // All filters come from URL search params
  const selectedCity = searchParams.get('city');
  const selectedSubcategory = searchParams.get('subcategory');
  const maxDistance = searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined;

  const { getEnglishByDisplay } = useCategories();
  const { getDisplayByCityName } = useCities();
  const { t, i18n } = useTranslation('studios');
  const isRTL = i18n.dir() === 'rtl';
  const { showPrompt, hasGranted, userLocation, setUserLocation } = useLocationPermission();
  const { position, getCurrentPosition } = useGeolocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const musicSubCategories = useMusicSubCategories();

  // Prepare category chips data for the carousel
  interface CategoryChipData {
    _id: string;
    label: string;
    englishKey: string;
    isAllStudios?: boolean;
  }

  const categoryChipsData = useMemo<CategoryChipData[]>(() => {
    const allStudiosChip: CategoryChipData = {
      _id: 'all-studios',
      label: t('page.allStudios', { defaultValue: 'All Studios' }),
      englishKey: '',
      isAllStudios: true
    };

    const subcategoryChips: CategoryChipData[] = musicSubCategories.map((cat) => ({
      _id: getEnglishByDisplay(cat),
      label: cat,
      englishKey: getEnglishByDisplay(cat)
    }));

    return [allStudiosChip, ...subcategoryChips];
  }, [musicSubCategories, getEnglishByDisplay, t]);

  // Calculate selected index for centering in carousel
  const selectedCategoryIndex = useMemo(() => {
    if (!selectedSubcategory) return 0; // "All Studios" is at index 0
    const index = categoryChipsData.findIndex((chip) => chip.englishKey === selectedSubcategory);
    return index >= 0 ? index : 0;
  }, [selectedSubcategory, categoryChipsData]);

  // Prepare city chips data for the carousel
  interface CityChipData {
    _id: string;
    name: string;
    displayName: string;
  }

  const cityChipsData = useMemo<CityChipData[]>(() => {
    return cities.map((city) => ({
      _id: city.name,
      name: city.name,
      displayName: getDisplayByCityName(city.name)
    }));
  }, [getDisplayByCityName]);

  // Calculate selected city index for centering in carousel
  const selectedCityIndex = useMemo(() => {
    if (!selectedCity) return -1; // No city selected, don't center
    const index = cityChipsData.findIndex((chip) => chip.name === selectedCity);
    return index >= 0 ? index : -1;
  }, [selectedCity, cityChipsData]);

  // Show popup on first visit
  useEffect(() => {
    if (showPrompt) {
      setShowPopup(true);
    }
  }, [showPrompt]);

  // Get location if permission was previously granted but location not in storage
  useEffect(() => {
    if (hasGranted && !userLocation && !position) {
      getCurrentPosition();
    }
  }, [hasGranted, userLocation, position, getCurrentPosition]);

  // Update context location when position is available (if not already set)
  useEffect(() => {
    if (position && !userLocation) {
      setUserLocation({ latitude: position.latitude, longitude: position.longitude });
    }
  }, [position, userLocation, setUserLocation]);

  const filteredStudios: Studio[] = filterStudios(studios, {
    subcategory: selectedSubcategory || undefined,
    city: selectedCity || undefined,
    userLocation: userLocation,
    maxDistance: featureFlags.distanceSlider ? maxDistance : undefined
  });

  const hasFilters =
    Boolean(selectedSubcategory || selectedCity) || (featureFlags.distanceSlider && maxDistance !== undefined);

  // Handle subcategory filter click - works exactly like city
  const handleSubcategoryClick = (cat: string) => {
    const englishCat = getEnglishByDisplay(cat);
    if (selectedSubcategory === englishCat) {
      searchParams.delete('subcategory');
    } else {
      searchParams.set('subcategory', englishCat);
    }
    setSearchParams(searchParams);
  };

  // Handle city filter click
  const handleCityClick = (cityName: string) => {
    if (selectedCity === cityName) {
      searchParams.delete('city');
    } else {
      searchParams.set('city', cityName);
    }
    setSearchParams(searchParams);
  };

  // Handle "All Studios" click - clears subcategory filter
  const handleAllStudiosClick = () => {
    searchParams.delete('subcategory');
    setSearchParams(searchParams);
  };

  // Handle sidebar filters apply
  const handleFiltersApply = (filters: FilterState) => {
    // Apply subcategory filter
    if (filters.categories.length > 0) {
      searchParams.set('subcategory', filters.categories[0]);
    } else {
      searchParams.delete('subcategory');
    }

    // Apply city filter
    if (filters.location) {
      searchParams.set('city', filters.location);
    } else {
      searchParams.delete('city');
    }

    setSearchParams(searchParams);
    setShowFilters(false);
  };

  return (
    <section className="studios-page">
      <LocationWelcomePopup open={showPopup} onClose={() => setShowPopup(false)} />

      {/* Header Section */}
      <div className="studios-page__header">
        <div className="studios-page__header-content">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="studios-page__title">
            {t('page.discover', { defaultValue: 'Discover' })}{' '}
            <span className="studios-page__title-accent">{t('page.amazing', { defaultValue: 'Amazing' })}</span>{' '}
            {t('page.studios', { defaultValue: 'Studios' })}
          </motion.h1>
          <p className="studios-page__subtitle">
            {t('page.subtitle', {
              defaultValue: 'Find and book professional recording, podcast, and photography spaces across Israel.'
            })}
          </p>
        </div>

        <button onClick={() => setShowMap(!showMap)} className="studios-page__view-toggle">
          {showMap ? <ViewListIcon /> : <MapIcon />}
          <span>
            {showMap
              ? t('page.showList', { defaultValue: 'Show List' })
              : t('page.showMap', { defaultValue: 'Show Map' })}
          </span>
        </button>
      </div>

      {/* Subcategory Filters */}
      <div className="studios-page__filters">
        <GenericCarousel
          data={categoryChipsData}
          className="studios-page__filters-carousel"
          autoWidth
          hideHeader
          inlineNavigation
          spaceBetween={12}
          selectedIndex={selectedCategoryIndex + 2} // +2 to account for prepended slides (filters button + separator)
          prependSlides={[
            // Filters button
            <button key="filters-btn" className="filter-chip filter-chip--outline" onClick={() => setShowFilters(true)}>
              <TuneIcon />
              <span>{t('page.filters', { defaultValue: 'Filters' })}</span>
            </button>,
            // Separator
            <div key="separator" className="studios-page__filters-divider" />
          ]}
          renderItem={(chip) => {
            const isActive = chip.isAllStudios ? !selectedSubcategory : selectedSubcategory === chip.englishKey;
            const Icon = chip.isAllStudios ? MusicProductionIcon : getSubcategoryIcon(chip.englishKey);
            const handleClick = chip.isAllStudios ? handleAllStudiosClick : () => handleSubcategoryClick(chip.label);

            return (
              <FilterChip key={chip._id} label={chip.label} icon={<Icon />} isActive={isActive} onClick={handleClick} />
            );
          }}
        />
      </div>

      {/* Cities Filter */}
      <div className="studios-page__cities">
        <GenericCarousel
          data={cityChipsData}
          className="studios-page__cities-carousel"
          autoWidth
          hideHeader
          inlineNavigation
          spaceBetween={8}
          selectedIndex={selectedCityIndex >= 0 ? selectedCityIndex : undefined}
          renderItem={(city) => (
            <button
              key={city._id}
              onClick={() => handleCityClick(city.name)}
              className={`city-chip ${selectedCity === city.name ? 'city-chip--active' : ''}`}
            >
              <LocationOnIcon />
              <span>{city.displayName}</span>
            </button>
          )}
        />
      </div>

      {featureFlags.distanceSlider && <DistanceSlider />}

      {/* Grid or Map View */}
      <div className="studios-page__content">
        {showMap ? (
          <Suspense
            fallback={
              <div className="studios-page__map-loader">
                <div className="studios-page__map-loader-spinner" />
              </div>
            }
          >
            <div className="studios-page__map-container">
              <LazyStudiosMap studios={filteredStudios} selectedCity={selectedCity} userLocation={userLocation} />
              <button onClick={() => setShowMap(false)} className="studios-page__back-to-list">
                {t('page.backToList', { defaultValue: 'Back to List' })}
              </button>
            </div>
          </Suspense>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="studios-page__grid">
            {filteredStudios.length > 0 ? (
              filteredStudios.map((studio) => (
                <motion.div
                  key={studio._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="studios-page__grid-item"
                >
                  <StudioCard studio={studio} />
                </motion.div>
              ))
            ) : (
              <StudiosList studios={[]} hasFilters={hasFilters} />
            )}
          </motion.div>
        )}
      </div>

      {/* Sidebar Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="studios-page__filters-overlay"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="studios-page__filters-sidebar"
            >
              <SidebarFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleFiltersApply}
                studios={studios}
                initialFilters={{
                  categories: selectedSubcategory ? [selectedSubcategory] : [],
                  location: selectedCity || ''
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StudiosPage;
