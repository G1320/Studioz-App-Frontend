import { GenericCarousel } from '@shared/components';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview } from '@features/entities';
import { useModal, useUserContext } from '@core/contexts';
import { useStudio, useWishlists } from '@shared/hooks';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Cart, Item, User } from 'src/types/index';

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

  const { selectedItem, openModal } = useModal();

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
      <StudioDetails user={user as User} studio={currStudio} />
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
    </section>
  );
};

export default StudioDetailsPage;
