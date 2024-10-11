import { ItemsList } from '@/components';
import { useParams } from 'react-router-dom';
import { Item } from '@/types/index';

interface ServicesProps {
  items?: Item[];
}

export const Services: React.FC<ServicesProps> = ({ items }) => {
  const { category, subcategory } = useParams<{ category?: string; subcategory?: string }>();

  const filteredItems = items?.filter((item) => {
    if (subcategory === undefined) {
      return item?.category?.toLowerCase() === category?.toLowerCase();
    } else {
      return (
        item?.category?.toLowerCase() === category?.toLowerCase() &&
        item?.subcategory?.toLowerCase() === subcategory?.toLowerCase()
      );
    }
  });

  return (
    <section className="services-page">
      <ItemsList items={filteredItems} className="Items-list" />
    </section>
  );
};

export default Services;
