import { Hero, ItemsList } from '@/components';
import { Item } from '@/types/index';

interface StoreProps {
  items: Item[];
}

export const Store: React.FC<StoreProps> = ({ items = [] }) => {
  return (
    <section className="store-page">
      <Hero></Hero>
      <ItemsList items={items} />
    </section>
  );
};

export default Store;
