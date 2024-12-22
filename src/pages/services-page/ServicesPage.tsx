import { ItemsList, ItemsMap } from '@components/index';
import { useParams } from 'react-router-dom';
import { Item } from 'src/types/index';

interface ServicesPageProps {
  items?: Item[];
}
const ServicesPage: React.FC<ServicesPageProps> = ({ items = [] }) => {
  const { category, subCategory } = useParams();

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

  return (
    <section className="services-page">
      <ItemsMap items={subCategory ? filteredItems : items} />
      <ItemsList items={subCategory ? filteredItems : items} className="Items-list" />
    </section>
  );
};
export default ServicesPage;
