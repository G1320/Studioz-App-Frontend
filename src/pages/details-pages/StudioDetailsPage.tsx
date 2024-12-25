import { GenericCarousel } from '@components/common';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview, ItemDetails } from '@components/index';
import { useModal } from '@contexts/ModalContext';
import { useUserContext } from '@contexts/UserContext';
import { useStudio } from '@hooks/dataFetching';
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
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { currStudio } = studioObj || {};

  const { selectedItem, openModal, closeModal } = useModal();

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  const getStudioServicesDisplayName = (name: string) => (name?.length > 1 ? `${name}'s Services` : '');

  const handleItemClick = (item: Item) => {
    openModal(item);
  };

  return (
    <section className="details studio-details-page">
      <StudioDetails user={user} studio={currStudio} />

      <GenericCarousel
        title={(() => getStudioServicesDisplayName(currStudio?.nameEn || ''))()}
        data={filteredItems}
        renderItem={(item) => (
          <div onClick={() => handleItemClick(item)} key={item._id}>
            <ItemPreview item={item} />
          </div>
        )}
      />
      {!selectedItem && <ContinueToCheckoutButton cart={cart} />}
      <Modal open={!!selectedItem} onClose={closeModal} className="item-modal">
        <div className="modal-content">
          {selectedItem && <ItemDetails cart={cart} studio={studioObj?.currStudio} item={selectedItem} />}
        </div>
      </Modal>
    </section>
  );
};

export default StudioDetailsPage;
