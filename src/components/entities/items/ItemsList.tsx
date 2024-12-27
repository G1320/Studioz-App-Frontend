import { ItemPreview, GenericList, ItemDetails } from '@components/index';
import { getLocalUser } from '@services/index';
import { useWishlists } from '@hooks/index';
import { Item } from 'src/types/index';
import { Modal } from '@mui/material';
import { useModal } from '@contexts/ModalContext';

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
      <Modal open={!!selectedItem} onClose={closeModal} className="item-modal">
        <div className="modal-content">
          {selectedItem && <ItemDetails itemId={selectedItem._id} wishlists={wishlists} />}
        </div>
      </Modal>
    </section>
  );
};
