import { ItemsList } from '@/components';
import { useParams } from 'react-router-dom';
import { Item } from '@/types/index';

interface ServicesPageProps {
  items?: Item[];
}

const ServicesPage: React.FC<ServicesPageProps> = ({ items }) => {
  const { category, subCategory } = useParams();
  const filteredItems = items?.filter((item) => {
    if (subCategory === undefined) {
      return item?.category?.toLowerCase() === category?.toLowerCase();
    } else {
      return (
        item?.category?.toLowerCase() === category?.toLowerCase() &&
        item?.subCategory?.toLowerCase() === subCategory?.toLowerCase()
      );
    }
  });

  return (
    <section className="services-page">
      <ItemsList items={filteredItems?.length ? filteredItems : items} className="Items-list" />
    </section>
  );
};
export default ServicesPage;
