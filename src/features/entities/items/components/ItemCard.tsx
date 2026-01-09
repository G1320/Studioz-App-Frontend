import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, StatusBadge, InstantBookBadge } from '@shared/components';
import { useAddItemToWishlistMutation, useRemoveItemFromWishlistMutation, usePrefetchItem } from '@shared/hooks';
import { useUserContext, useModal } from '@core/contexts';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { Item, Wishlist, User } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { featureFlags } from '@core/config/featureFlags';
import { ItemFeatures } from './ItemFeatures';
import '../styles/_item-card.scss';

interface ItemCardProps {
  item: Item;
  wishlists?: Wishlist[];
  showDistanceBadge?: boolean;
  user?: User;
  onEdit?: (itemId: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  wishlists = [],
  showDistanceBadge = true,
  user: propUser,
  onEdit
}) => {
  const { wishlistId } = useParams();
  const { user: contextUser } = useUserContext();
  const { loadingItemId } = useModal();
  const user = propUser || contextUser;
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t, i18n } = useTranslation(['common', 'forms']);
  const { userLocation } = useLocationPermission();

  const isLoading = loadingItemId === item?._id;

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

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item?._id);

  const getTranslatedPricePer = (pricePer: string) => {
    const pricePerMap: Record<string, string> = {
      hour: t('forms:form.pricePer.hour'),
      session: t('forms:form.pricePer.session'),
      unit: t('forms:form.pricePer.unit'),
      project: t('forms:form.pricePer.project'),
      day: t('forms:form.pricePer.day'),
      song: t('forms:form.pricePer.song')
    };

    return pricePerMap[pricePer] || pricePer;
  };

  const titleText = item?.name?.[currentLang] || item?.name?.en || '';

  return (
    <article
      onMouseEnter={prefetchItem}
      key={item?._id}
      className={`card item-card ${isLoading ? 'item-card--loading' : ''}`}
    >
      {isLoading && (
        <div className="item-card__loading-overlay">
          <div className="item-card__spinner" />
        </div>
      )}
      <div className="item-card-name-and-description">
        <h3 className="title">{titleText}</h3>
        <p className="description">{item?.description[currentLang] || item?.description.en}</p>
        <div className="item-price-container">
          <small className="item-price">
            ₪{item?.price}/{getTranslatedPricePer(item?.pricePer || '')}
          </small>
          <StatusBadge createdAt={item?.createdAt} />
          <InstantBookBadge instantBook={item?.instantBook} />
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
        user={user || undefined}
        onEdit={onEdit}
      />
    </article>
  );
};
