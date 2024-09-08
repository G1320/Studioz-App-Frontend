import ItemsList from '../../entities/items/itemsList';
import Hero from '../../layout/hero/hero';
import { Item } from '../../../types/index';

interface StoreProps {
  items: Item[];
}

const Store: React.FC<StoreProps> = ({ items = [] }) => {
  return (
    <section className="store-page">
      <Hero></Hero>
      <ItemsList items={items} />
    </section>
  );
};

export default Store;
