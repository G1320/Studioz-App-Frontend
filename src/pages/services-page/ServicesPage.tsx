import { CategoryPreview, GenericCarousel, ItemsList, ItemsMap } from '@components/index';
import { useCategories, useMusicSubCategories } from '@hooks/utils';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Item } from 'src/types/index';

interface ServicesPageProps {
  items?: Item[];
}
const ServicesPage: React.FC<ServicesPageProps> = ({ items = [] }) => {
  const { category, subCategory } = useParams();
  // const { t } = useTranslation('homePage');
  const { getDisplayByEnglish } = useCategories();

  const musicSubCategories = useMusicSubCategories();

  const filteredItems = items?.filter((item) => {
    if (!category) return true;
    if (subCategory === undefined) {
      return item?.categories?.includes(category || '');
    } else {
      return item?.subCategories?.includes(subCategory);
    }
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} pathPrefix="services" />;

  const subcategoryDisplay = subCategory ? getDisplayByEnglish(subCategory) : subCategory;

  return (
    <section className="services-page">
      {subcategoryDisplay ? <h1>{subcategoryDisplay}</h1> : <h1>Services</h1>}
      <GenericCarousel
        data={musicSubCategories}
        className="categories-carousel slider-gradient"
        renderItem={categoryRenderItem}
        // title={t('sections.categories')}
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
