import { useNavigate } from 'react-router-dom';
import { Button } from '@components/index';
import { Wishlist } from 'src/types/index';

interface WishlistPreviewProps {
  wishlist: Wishlist;
  onAddItemToWishList?: (wishlistId: string) => void;
}

export const WishlistPreview: React.FC<WishlistPreviewProps> = ({ wishlist, onAddItemToWishList = null }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/wishlists/${wishlist._id}`)}
      key={wishlist._id}
      className="preview wishlist-preview"
    >
      <div>
        {onAddItemToWishList ? (
          <Button onClick={() => onAddItemToWishList(wishlist?._id)}>Add to {wishlist?.name}</Button>
        ) : (
          <h3> {wishlist.name}</h3>
        )}
        <div>
          <small>{wishlist?.items?.length} Items</small>
          <small>{wishlist?.studios?.length} Studios</small>
        </div>
      </div>
    </article>
  );
};
