import { CategoryPreview, StudiosList, CityPreview } from '@features/entities';
import { StudiosMap } from '@shared/components';
import { GenericCarousel } from '@shared/components';
import { useCategories, useMusicSubCategories } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Studio } from 'src/types/index';
import { cities } from '@core/config/cities/cities';

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

  const filteredStudios: Studio[] = studios?.filter((studio) => {
    const matchesCategory = (() => {
      if (!category) return true;
      if (!subcategory) {
        return studio?.categories?.includes(category || '');
      } else {
        return studio?.subCategories?.includes(subcategory);
      }
    })();

    const matchesCity = selectedCity ? studio?.city === selectedCity : true;

    return matchesCategory && matchesCity;
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} />;
  const cityRenderItem = (city: (typeof cities)[number]) => <CityPreview city={city} />;

  const subcategoryDisplay = subcategory ? getDisplayByEnglish(subcategory) : subcategory;
  const cityDisplay = selectedCity ? t('page.city_selected', { city: selectedCity }) : t('page.cities_title');

  return (
    <section className="studios-page">
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
      <GenericCarousel
        data={cities}
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
      <StudiosMap studios={filteredStudios} />
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default StudiosPage;
