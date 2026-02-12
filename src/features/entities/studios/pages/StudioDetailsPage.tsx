import '../styles/_index.scss';
import { GenericCarousel } from '@shared/components';
import { StudioDetails } from '@features/entities/studios/components/StudioDetails';
import { ContinueToCheckoutButton } from '@features/entities/orders/components/ContinueToCheckoutButton';
import { ItemCard } from '@features/entities/items/components/ItemCard';
import { useModal, useUserContext } from '@core/contexts';
import { useStudio, useWishlists } from '@shared/hooks';
import { StudioSchema } from '@shared/components/seo';
import { trackEvent } from '@shared/utils/analytics';

import { useEffect, useState, useRef } from 'react';
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

  const { selectedItemId, openModal } = useModal();
  const trackedStudioRef = useRef<string | null>(null);

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  // Track ViewContent event when studio is loaded (once per studio)
  useEffect(() => {
    if (currStudio && currStudio._id !== trackedStudioRef.current) {
      trackedStudioRef.current = currStudio._id;
      // Get minimum price from studio items for Meta tracking
      const prices = currStudio.items?.map((item) => item.price).filter((p): p is number => p !== undefined && p > 0);
      const minPrice = prices && prices.length > 0 ? Math.min(...prices) : 0;
      trackEvent('ViewContent', {
        content_name: currStudio.name?.en || currStudio.name?.he || 'Studio',
        content_category: 'Studio',
        content_ids: [currStudio._id],
        content_type: 'product',
        currency: 'ILS',
        value: minPrice
      });
    }
  }, [currStudio?._id]);

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

  const currentLang = (i18n.language === 'he' ? 'he' : 'en') as 'en' | 'he';

  return (
    <section className="details studio-details-page">
      {/* Rich Schema Markup for SEO */}
      {currStudio && <StudioSchema studio={currStudio} items={filteredItems} lang={currentLang} />}

      <StudioDetails user={user as User} studio={currStudio} />
      {currStudio?.items && currStudio.items.length > 0 && (
        <GenericCarousel
          title={(() =>
            getStudioServicesDisplayName(
              currStudio?.name?.[i18n.language === 'he' ? 'he' : 'en'] || currStudio?.name?.en
            ))()}
          data={filteredItems}
          renderItem={(item) => (
            <div onClick={() => handleItemClick(item)} key={item._id}>
              <ItemCard item={item} wishlists={wishlists} showDistanceBadge={false} studioActive={currStudio?.active} />
            </div>
          )}
        />
      )}
      {!selectedItemId && <ContinueToCheckoutButton cart={cart} />}
    </section>
  );
};

export default StudioDetailsPage;
