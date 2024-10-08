import { ItemsList } from '@/components';
import { Item } from '@/types/index';

interface StoreProps {
  items: Item[];
}

export const Store: React.FC<StoreProps> = ({ items = [] }) => {
  return (
    <section className="store-page">
      <ItemsList items={items} />
    </section>
  );
};

export default Store;
