import { GenericCarousel } from '@components/common';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview, ItemDetails } from '@components/index';
import { useModal } from '@contexts/ModalContext';
import { useUserContext } from '@contexts/UserContext';
import { useStudio, useWishlists } from '@hooks/dataFetching';
import { Modal } from '@mui/material';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cart, Item } from 'src/types/index';

interface StudioDetailsPageProps {
  items: Item[];
  cart: Cart;
}

const StudioDetailsPage: React.FC<StudioDetailsPageProps> = ({ items, cart }) => {
  const { user } = useUserContext();
  const { studioId } = useParams();

  const { data: studioObj } = useStudio(studioId || '');
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { currStudio } = studioObj || {};

  const { selectedItem, openModal, closeModal } = useModal();

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  const handleItemClick = (item: Item) => {
    openModal(item);
  };
  const getStudioServicesDisplayName = (name: string | undefined) => {
    return name && name.length > 1 ? `${name}'s Services` : 'Studio Services';
  };

  return (
    <section className="details studio-details-page">
      <StudioDetails user={user} studio={currStudio} />

      <GenericCarousel
        title={(() => getStudioServicesDisplayName(currStudio?.name?.en))()}
        data={filteredItems}
        renderItem={(item) => (
          <div onClick={() => handleItemClick(item)} key={item._id}>
            <ItemPreview item={item} wishlists={wishlists} />
          </div>
        )}
      />
      {!selectedItem && <ContinueToCheckoutButton cart={cart} />}
      <Modal open={!!selectedItem} onClose={closeModal} className="item-modal">
        <div className="modal-content">{selectedItem && <ItemDetails cart={cart} itemId={selectedItem._id} />}</div>
      </Modal>
    </section>
  );
};

export default StudioDetailsPage;
