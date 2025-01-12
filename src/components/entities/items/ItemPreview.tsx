import { useParams } from 'react-router-dom';
import { Button, GenericMuiDropdown, WishlistPreview } from '@components/index';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  useAddItemToWishlistMutation,
  // useLanguageNavigate,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation
} from '@hooks/index';
import { useUserContext } from '@contexts/index';
import { Item, Wishlist } from 'src/types/index';
import { usePrefetchItem } from '@hooks/prefetching/index';

import { useTranslation } from 'react-i18next';
interface ItemPreviewProps {
  item: Item;
  wishlists?: Wishlist[];
}

export const ItemPreview: React.FC<ItemPreviewProps> = ({ item, wishlists = [] }) => {
  const { studioId, wishlistId } = useParams();
  const { user } = useUserContext();
  // const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t } = useTranslation('common');

  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item._id);

  const renderItem = (wishlist: Wishlist) => (
    <WishlistPreview
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

  return (
    <article onMouseEnter={prefetchItem} key={item._id} className="preview item-preview">
      <header className="item-preview-header">
        <h3>{item.name.en}</h3>
        <div>
          <small className="item-price">
            ₪{item.price}/{item.pricePer}
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
            className="item-details-wishlists-dropdown"
            title={t('buttons.add_to_wishlist')}
          />
        )
      )}

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
