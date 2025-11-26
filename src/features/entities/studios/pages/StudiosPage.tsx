import { CategoryPreview, StudiosList, CityPreview } from '@features/entities';
import { StudiosMap, GenericCarousel } from '@shared/components';
import { useCategories, useMusicSubCategories } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Studio } from 'src/types/index';
import { cities } from '@core/config/cities/cities';
import { filterStudios } from '../utils/filterStudios';

interface StudiosPageProps {
  studios: Studio[];
}

const StudiosPage: React.FC<StudiosPageProps> = ({ studios }) => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city');
  const { getDisplayByEnglish } = useCategories();
  const { t } = useTranslation('studios');

  const musicSubCategories = useMusicSubCategories();

  const filteredStudios: Studio[] = filterStudios(studios, {
    category,
    subcategory,
    city: selectedCity
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} />;
  const cityRenderItem = (city: (typeof cities)[number]) => <CityPreview city={city} />;

  const subcategoryDisplay = subcategory ? getDisplayByEnglish(subcategory) : subcategory;
  const cityDisplay = selectedCity ? t('page.city_selected', { city: selectedCity }) : t('page.cities_title');

  return (
    <section className="studios-page">
      <GenericCarousel
        data={cities}
        showNavigation={false}
        className="cities-carousel slider-gradient"
        renderItem={cityRenderItem}
        title={cityDisplay}
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
        breakpoints={{
          340: { slidesPerView: 3.4 },
          520: { slidesPerView: 4.2 },
          800: { slidesPerView: 4.4 },
          1000: { slidesPerView: 5.2 },
          1200: { slidesPerView: 6.2 },
          1550: { slidesPerView: 7.2 }
        }}
      />
      <StudiosMap studios={filteredStudios} selectedCity={selectedCity} />
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default StudiosPage;
