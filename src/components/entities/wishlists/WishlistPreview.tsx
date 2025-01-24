import { Button } from '@shared/components';
import { Wishlist } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';

interface WishlistPreviewProps {
  wishlist: Wishlist;
  onAddItemToWishList?: (wishlistId: string) => void;
}

export const WishlistPreview: React.FC<WishlistPreviewProps> = ({ wishlist, onAddItemToWishList = null }) => {
  const langNavigate = useLanguageNavigate();

  return (
    <article
      onClick={() => langNavigate(`/wishlists/${wishlist._id}`)}
      key={wishlist._id}
      className=" wishlist-preview"
    >
      <div>
        <div>
          <small>{wishlist?.items?.length} Items</small>
        </div>
        {onAddItemToWishList ? (
          <Button onClick={() => onAddItemToWishList(wishlist?._id)}>Add to {wishlist?.name}</Button>
        ) : (
          <h3> {wishlist.name}</h3>
        )}
      </div>
    </article>
  );
};
