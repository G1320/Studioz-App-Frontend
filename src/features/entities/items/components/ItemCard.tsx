import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { WishlistCard } from '@features/entities';
import { Button, GenericMuiDropdown, DistanceBadge } from '@shared/components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
  const { t } = useTranslation(['common', 'forms']);
  const { userLocation } = useLocationPermission();

  // Calculate distance if user location is available and badge should be shown
  const distance = useMemo(() => {
    if (!featureFlags.itemCardDistanceBadge || !showDistanceBadge || !userLocation || !item?.lat || !item?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, item.lat, item.lng);
  }, [showDistanceBadge, userLocation, item?.lat, item?.lng]);

  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item._id);

  const renderItem = (wishlist: Wishlist) => (
    <WishlistCard
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  const getCityForDisplay = (address: string) => {
    if (!address || !address.includes(',')) return '';
    const addressParts = address.split(',').map((part) => part.trim());
    const cityPart = addressParts[addressParts.length - 2];
    if (/^\d+$/.test(cityPart)) {
      return addressParts[addressParts.length - 3] || '';
    }
    return cityPart || '';
  };

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
    <article onMouseEnter={prefetchItem} key={item._id} className="card item-card">
      <header className="item-card-header">
        <h3>{item.name.en}</h3>
        <div className="item-card-header__right">
          <small className="item-price">
            ₪{item.price}/{getTranslatedPricePer(item.pricePer || '')}
          </small>
        </div>
      </header>
      <p>{item.description.en}</p>
      {wishlistId ? (
        <Button className="remove-from-wishlist-button" onClick={handleRemoveItemFromWishlist}>
          Remove from Wishlist
        </Button>
      ) : (
        user?._id && (
          <GenericMuiDropdown
            data={wishlists}
            renderItem={renderItem}
            className="item-card-wishlists-dropdown"
            title={t('buttons.add_to_wishlist')}
          />
        )
      )}
      {distance !== null && <DistanceBadge distance={distance} />}
      {studioId && user?.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio-button">
          Remove from Studio
        </Button>
      )}
      <footer>
        <div className="studio-name-location-container">
          <LocationOnIcon className="locations-icon" />
          <strong>{item.studioName?.en}</strong>
        </div>
        {item.address && <small>{getCityForDisplay(item.address)}</small>}
      </footer>
    </article>
  );
};

