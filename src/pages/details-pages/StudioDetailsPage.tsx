import { GenericCarousel } from '@components/common';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview } from '@components/index';
import { useUserContext } from '@contexts/UserContext';
import { useStudio } from '@hooks/dataFetching';

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

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  const getStudioServicesDisplayName = (name: string) => (name?.length > 1 ? `${name}'s Services` : '');

  return (
    <section className="details studio-details-page">
      <StudioDetails user={user} studio={currStudio} />

      <GenericCarousel
        title={(() => getStudioServicesDisplayName(currStudio?.name || ''))()}
        data={filteredItems}
        renderItem={(item) => <ItemPreview item={item} />}
      />
      <ContinueToCheckoutButton cart={cart} />
    </section>
  );
};

export default StudioDetailsPage;
