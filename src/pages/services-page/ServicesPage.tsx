import { CategoryPreview, GenericCarousel, ItemsList, ItemsMap } from '@components/index';
import { useMusicSubCategories } from '@hooks/utils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Item } from 'src/types/index';

interface ServicesPageProps {
  items?: Item[];
}
const ServicesPage: React.FC<ServicesPageProps> = ({ items = [] }) => {
  const { category, subCategory } = useParams();
  const { t } = useTranslation('homePage');
  const musicSubCategories = useMusicSubCategories();

  const filteredItems = items?.filter((item) => {
    if (subCategory === undefined) {
      // For category matching, check both arrays and single field
      const categoryMatches =
        // Check the single category field
        item?.category?.toLowerCase() === category?.toLowerCase() ||
        // Check the categories array
        item?.categories?.some((cat) => cat.toLowerCase() === 'Music / Podcast Studio'.toLowerCase());

      return categoryMatches;
    } else {
      // For subcategory, check both arrays and single field
      const subCategoryMatches =
        item?.subCategories?.some((sub) => sub.toLowerCase() === subCategory.toLowerCase()) ||
        item?.subCategory?.toLowerCase() === subCategory.toLowerCase();
      return subCategoryMatches;
    }
  });

  const categoryRenderItem = (category: string) => <CategoryPreview category={category} pathPrefix="services" />;

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
      <ItemsMap items={subCategory ? filteredItems : items} />
      <ItemsList items={subCategory ? filteredItems : items} className="Items-list-container" />
    </section>
  );
};
export default ServicesPage;
