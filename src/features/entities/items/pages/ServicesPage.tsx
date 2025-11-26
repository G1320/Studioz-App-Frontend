import { CategoryPreview, ItemsList } from '@features/entities';
import { ItemsMap, GenericCarousel } from '@shared/components';
import { useCategories, useMusicSubCategories } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Item } from 'src/types/index';
import { filterItems } from '../utils/filterItems';

interface ServicesPageProps {
  items?: Item[];
}
const ServicesPage: React.FC<ServicesPageProps> = ({ items = [] }) => {
  const { category, subCategory } = useParams();
  const { getDisplayByEnglish } = useCategories();
  const { t } = useTranslation('services');

  const musicSubCategories = useMusicSubCategories();

  const filteredItems = filterItems(items, { category, subCategory });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} pathPrefix="services" />;

  const subcategoryDisplay = subCategory ? getDisplayByEnglish(subCategory) : subCategory;

  return (
    <section className="services-page">
      <h1>{t('page.title')}</h1>
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
      <ItemsMap items={subCategory ? filteredItems : items} />

      <ItemsList items={subCategory ? filteredItems : items} className="Items-list-container" />
    </section>
  );
};
export default ServicesPage;
