import { CategoryPreview, GenericCarousel, StudiosList, StudiosMap } from '@components/index';
import { useCategories, useMusicSubCategories } from '@hooks/utils';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router-dom';
import { Studio } from 'src/types/index';

interface StudiosPageProps {
  studios: Studio[];
}

const StudiosPage: React.FC<StudiosPageProps> = ({ studios }) => {
  const { category, subcategory } = useParams();
  const { t } = useTranslation('homePage');
  const { getDisplayByEnglish } = useCategories();

  const musicSubCategories = useMusicSubCategories();

  const filteredStudios: Studio[] = studios?.filter((studio) => {
    if (!category) return true;
    if (!subcategory) {
      return studio?.categories?.includes(category || '');
    } else {
      return studio?.subCategories?.includes(subcategory);
    }
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} />;

  const subcategoryDisplay = subcategory ? getDisplayByEnglish(subcategory) : subcategory;

  return (
    <section className="studios-page">
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
      <StudiosMap studios={filteredStudios} />
      {subcategoryDisplay && <h1>{subcategoryDisplay}</h1>}
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default StudiosPage;
