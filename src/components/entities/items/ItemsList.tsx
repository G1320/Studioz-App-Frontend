import { ItemPreview, ItemDetails } from '@components/index';
import { GenericList, GenericModal } from '@shared/components';
import { getLocalUser } from '@shared/services/index';
import { useWishlists } from '@shared/hooks/index';
import { Item } from 'src/types/index';
import { useModal } from '@core/contexts';

interface ItemListProps {
  items?: Item[];
  className?: string;
}

export const ItemsList: React.FC<ItemListProps> = ({ items = [], className }) => {
  const user = getLocalUser();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const { selectedItem, openModal, closeModal } = useModal();

  const handleItemClick = (item: Item) => {
    openModal(item);
  };

  // const renderItem = (item: Item) => <ItemPreview item={item} key={item.name} wishlists={wishlists} />;
  const renderItem = (item: Item) => (
    <div onClick={() => handleItemClick(item)} key={item._id}>
      <ItemPreview item={item} wishlists={wishlists} />
    </div>
  );

  return (
    <section className={`items ${className}`}>
      <GenericList data={items} renderItem={renderItem} className="items-list" />
      <GenericModal open={!!selectedItem} onClose={closeModal} className="item-modal">
        {selectedItem && <ItemDetails itemId={selectedItem._id} />}
      </GenericModal>
    </section>
  );
};
