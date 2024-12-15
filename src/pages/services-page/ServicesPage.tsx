import { ItemsList } from '@components/index';
import { useParams } from 'react-router-dom';
import { Item } from 'src/types/index';

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
      <h1>Browse our curated Services</h1>
      <ItemsList items={filteredItems?.length ? filteredItems : items} className="Items-list" />
    </section>
  );
};
export default ServicesPage;
