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
      // Check both array and single field for backwards compatibility
      return (
        item?.categories?.some((cat) => cat.toLowerCase() === category?.toLowerCase()) ||
        item?.category?.toLowerCase() === category?.toLowerCase()
      );
    } else {
      return (
        (item?.categories?.some((cat) => cat.toLowerCase() === category?.toLowerCase()) ||
          item?.category?.toLowerCase() === category?.toLowerCase()) &&
        (item?.subCategories?.some((subCat) => subCat.toLowerCase() === subCategory?.toLowerCase()) ||
          item?.subCategory?.toLowerCase() === subCategory?.toLowerCase())
      );
    }
  });

  return (
    <section className="services-page">
      <ItemsMap items={filteredItems} />
      <ItemsList items={filteredItems} className="Items-list" />
    </section>
  );
};
export default ServicesPage;
