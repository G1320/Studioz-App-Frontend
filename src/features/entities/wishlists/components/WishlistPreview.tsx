import { Button } from '@shared/components';
import { Wishlist } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { useCallback } from 'react';

interface WishlistPreviewProps {
  wishlist: Wishlist;
  onAddItemToWishList?: (wishlistId: string) => void;
}

export const WishlistPreview: React.FC<WishlistPreviewProps> = ({ wishlist, onAddItemToWishList = null }) => {
  const langNavigate = useLanguageNavigate();

  const handleArticleClick = useCallback(() => {
    if (!onAddItemToWishList) {
      langNavigate(`/wishlists/${wishlist._id}`);
    }
  }, [wishlist._id, onAddItemToWishList, langNavigate]);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddItemToWishList) {
        onAddItemToWishList(wishlist._id);
      }
    },
    [wishlist._id, onAddItemToWishList]
  );

  return (
    <article
      onClick={handleArticleClick}
      key={wishlist._id}
      className={`wishlist-preview ${onAddItemToWishList ? 'wishlist-preview--interactive' : ''}`}
    >
      <div className="wishlist-preview__content">
        <div className="wishlist-preview__header">
          <small className="wishlist-preview__count">{wishlist?.items?.length || 0} Items</small>
          <h3 className="wishlist-preview__name">{wishlist.name}</h3>
        </div>
        {onAddItemToWishList && (
          <Button className="wishlist-preview__button" onClick={handleButtonClick}>
            Add to {wishlist.name}
          </Button>
        )}
      </div>
    </article>
  );
};
