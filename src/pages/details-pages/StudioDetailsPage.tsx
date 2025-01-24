import { GenericCarousel, GenericModal } from '@shared/components';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview, ItemDetails } from '@components/index';
import { useModal, useUserContext } from '@core/contexts';
import { useStudio, useWishlists } from '@shared/hooks';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Cart, Item } from 'src/types/index';

interface StudioDetailsPageProps {
  items: Item[];
  cart?: Cart;
}

const StudioDetailsPage: React.FC<StudioDetailsPageProps> = ({ items, cart }) => {
  const { user } = useUserContext();
  const { studioId } = useParams();
  const { i18n } = useTranslation();

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
    return i18n.language === 'he'
      ? name && name.length > 1
        ? `השירותים של ${name}`
        : 'שירותי סטודיו'
      : name && name.length > 1
        ? `${name}'s Services`
        : 'Studio Services';
  };

  return (
    <section className="details studio-details-page">
      <StudioDetails user={user} studio={currStudio} />
      {currStudio?.items && currStudio.items.length > 0 && (
        <GenericCarousel
          title={(() => getStudioServicesDisplayName(currStudio?.name?.en))()}
          data={filteredItems}
          renderItem={(item) => (
            <div onClick={() => handleItemClick(item)} key={item._id}>
              <ItemPreview item={item} wishlists={wishlists} />
            </div>
          )}
        />
      )}
      {!selectedItem && <ContinueToCheckoutButton cart={cart} />}
      <GenericModal open={!!selectedItem} onClose={closeModal} className="item-modal">
        {selectedItem && <ItemDetails itemId={selectedItem._id} />}
      </GenericModal>
    </section>
  );
};

export default StudioDetailsPage;
