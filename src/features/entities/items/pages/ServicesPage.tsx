import { useEffect, Suspense } from 'react';
import { CategoryCard, ItemsList, CityCard } from '@features/entities';
import { GenericCarousel } from '@shared/components';
import { LazyItemsMap } from '@shared/components/maps';
import { useMusicSubCategories, useCities } from '@shared/hooks/utils';
import { useGeolocation } from '@shared/hooks/utils/geolocation';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Item } from 'src/types/index';
import { cities } from '@core/config/cities/cities';
import { filterItems } from '../utils/filterItems';

interface ServicesPageProps {
  items?: Item[];
}
const ServicesPage: React.FC<ServicesPageProps> = ({ items = [] }) => {
  const { category, subCategory } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city');
  const { getDisplayByCityName } = useCities();
  const { t } = useTranslation('services');
  const { hasGranted, userLocation, setUserLocation } = useLocationPermission();
  const { position, getCurrentPosition } = useGeolocation();

  const musicSubCategories = useMusicSubCategories();

  const filteredItems = filterItems(items, {
    category,
    subCategory,
    city: selectedCity,
    userLocation
  });

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

  const categoryRenderItem = (category: string) => <CategoryCard category={category} pathPrefix="services" />;
  const cityRenderItem = (city: (typeof cities)[number]) => <CityCard city={city} />;

  const translatedCityName = selectedCity ? getDisplayByCityName(selectedCity) : null;
  const cityDisplay = translatedCityName
    ? t('page.city_selected', { city: translatedCityName })
    : t('page.cities_title');

  // Find selected index for scrolling
  const selectedCityIndex = selectedCity ? cities.findIndex((city) => city.name === selectedCity) : undefined;

  return (
    <section className="services-page">
      <GenericCarousel
        data={musicSubCategories}
        className="categories-carousel slider-gradient"
        renderItem={categoryRenderItem}
        title={t('sections.categories')}
        breakpoints={{
          340: { slidesPerView: 3.4 },
          520: { slidesPerView: 4.2 },
          800: { slidesPerView: 4.4 },
          1000: { slidesPerView: 5.2 },
          1200: { slidesPerView: 6.2 },
          1550: { slidesPerView: 7.2 }
        }}
      />
      <GenericCarousel
        data={cities}
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
      <Suspense
        fallback={
          <div className="map-loader">
            <div className="map-loader__spinner"></div>
          </div>
        }
      >
        <LazyItemsMap items={filteredItems} selectedCity={selectedCity} userLocation={userLocation} />
      </Suspense>

      <ItemsList items={filteredItems} className="Items-list-container" />
    </section>
  );
};
export default ServicesPage;
