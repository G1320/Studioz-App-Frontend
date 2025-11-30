import { useState, useEffect } from 'react';
import { CategoryPreview, StudiosList, CityPreview } from '@features/entities';
import { StudiosMap, GenericCarousel, LocationWelcomePopup, DistanceSlider } from '@shared/components';
import { useCategories, useMusicSubCategories, useCities } from '@shared/hooks/utils';
import { useGeolocation } from '@shared/hooks/utils/geolocation';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Studio } from 'src/types/index';
import { cities } from '@core/config/cities/cities';
import { featureFlags } from '@core/config/featureFlags';
import { filterStudios } from '../utils/filterStudios';

interface StudiosPageProps {
  studios: Studio[];
}

const StudiosPage: React.FC<StudiosPageProps> = ({ studios }) => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city');
  const maxDistance = searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined;
  const { getDisplayByEnglish, getEnglishByDisplay } = useCategories();
  const { getDisplayByCityName } = useCities();
  const { t } = useTranslation('studios');
  const { showPrompt, hasGranted, userLocation, setUserLocation } = useLocationPermission();
  const { position, getCurrentPosition } = useGeolocation();
  const [showPopup, setShowPopup] = useState(false);

  const musicSubCategories = useMusicSubCategories();

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
    category,
    subcategory,
    city: selectedCity,
    userLocation: userLocation,
    maxDistance: featureFlags.distanceSlider ? maxDistance : undefined
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} />;
  const cityRenderItem = (city: (typeof cities)[number]) => <CityPreview city={city} />;

  const subcategoryDisplay = subcategory ? getDisplayByEnglish(subcategory) : subcategory;
  const translatedCityName = selectedCity ? getDisplayByCityName(selectedCity) : null;
  const cityDisplay = translatedCityName
    ? t('page.city_selected', { city: translatedCityName })
    : t('page.cities_title');

  // Find selected indices for scrolling
  const selectedCityIndex = selectedCity ? cities.findIndex((city) => city.name === selectedCity) : undefined;
  const selectedCategoryIndex = subcategory
    ? musicSubCategories.findIndex((cat) => getEnglishByDisplay(cat) === subcategory)
    : undefined;

  return (
    <section className="studios-page">
      <LocationWelcomePopup open={showPopup} onClose={() => setShowPopup(false)} />
      <GenericCarousel
        data={cities}
        showNavigation={false}
        className="cities-carousel slider-gradient"
        renderItem={cityRenderItem}
        title={cityDisplay}
        selectedIndex={selectedCityIndex !== undefined && selectedCityIndex >= 0 ? selectedCityIndex : undefined}
        breakpoints={{
          340: { slidesPerView: 2.4 },
          520: { slidesPerView: 3.2 },
          800: { slidesPerView: 4.2 },
          1200: { slidesPerView: 5.2 }
        }}
      />
      <GenericCarousel
        data={musicSubCategories}
        className="categories-carousel slider-gradient"
        renderItem={categoryRenderItem}
        title={subcategoryDisplay}
        selectedIndex={
          selectedCategoryIndex !== undefined && selectedCategoryIndex >= 0 ? selectedCategoryIndex : undefined
        }
        breakpoints={{
          340: { slidesPerView: 3.4 },
          520: { slidesPerView: 4.2 },
          800: { slidesPerView: 4.4 },
          1000: { slidesPerView: 5.2 },
          1200: { slidesPerView: 6.2 },
          1550: { slidesPerView: 7.2 }
        }}
      />
      {featureFlags.distanceSlider && <DistanceSlider />}
      <StudiosMap studios={filteredStudios} selectedCity={selectedCity} userLocation={userLocation} />
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default StudiosPage;
