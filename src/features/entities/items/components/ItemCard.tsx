import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, StatusBadge } from '@shared/components';
import {
  useAddItemToWishlistMutation,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation,
  usePrefetchItem
} from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { Item, Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { featureFlags } from '@core/config/featureFlags';
import { ItemFeatures } from './ItemFeatures';
import '../styles/_item-card.scss';

interface ItemCardProps {
  item: Item;
  wishlists?: Wishlist[];
  showDistanceBadge?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, wishlists = [], showDistanceBadge = true }) => {
  const { studioId, wishlistId } = useParams();
  const { user } = useUserContext();
  // const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t, i18n } = useTranslation(['common', 'forms']);
  const { userLocation } = useLocationPermission();

  // Get the current language (default to 'en' if not 'he')
  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  // Calculate distance if user location is available and badge should be shown
  const distance = useMemo(() => {
    if (!featureFlags.itemCardDistanceBadge || !showDistanceBadge || !userLocation || !item?.lat || !item?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, item.lat, item.lng);
  }, [showDistanceBadge, userLocation, item?.lat, item?.lng]);

  const addItemToWishlistMutation = useAddItemToWishlistMutation(item?._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item?._id);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item?._id);

  const getTranslatedPricePer = (pricePer: string) => {
    const pricePerMap: Record<string, string> = {
      hour: t('forms:form.pricePer.hour'),
      session: t('forms:form.pricePer.session'),
      unit: t('forms:form.pricePer.unit'),
      song: t('forms:form.pricePer.song')
    };

    return pricePerMap[pricePer] || pricePer;
  };

  return (
    <article onMouseEnter={prefetchItem} key={item?._id} className="card item-card">
      <div className="item-card-name-and-description">
        <h3 className="title">{item?.name.en}</h3>
        <p className="description">{item?.description[currentLang] || item?.description.en}</p>
        <div className="item-price-container">
          <small className="item-price">
            ₪{item?.price}/{getTranslatedPricePer(item?.pricePer || '')}
          </small>
          <StatusBadge createdAt={item?.createdAt} />
        </div>
      </div>
      {wishlistId && (
        <Button className="remove-from-wishlist-button" onClick={handleRemoveItemFromWishlist}>
          Remove from Wishlist
        </Button>
      )}
      <ItemFeatures
        item={item}
        wishlists={wishlists}
        distance={distance}
        onAddToWishlist={handleAddItemToWishlist}
        userId={user?._id}
        showDistanceBadge={showDistanceBadge}
      />

      {studioId && user?.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio-button">
          Remove from Studio
        </Button>
      )}
    </article>
  );
};
