import { ItemPreview, GenericList } from '@/components';
import { getLocalUser } from '@/services';
import { useWishlists } from '@/hooks';
import { Item } from '@/types/index';

interface ItemListProps {
  items?: Item[];
  className?: string;
}

export const ItemsList: React.FC<ItemListProps> = ({ items = [], className }) => {
  const user = getLocalUser();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const renderItem = (item: Item) => <ItemPreview item={item} key={item.name} wishlists={wishlists} />;

  return (
    <section className={`items ${className}`}>
      <GenericList data={items} renderItem={renderItem} className="items-list" />
    </section>
  );
};
