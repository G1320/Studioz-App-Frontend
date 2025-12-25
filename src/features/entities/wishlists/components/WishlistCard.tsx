import { Button } from '@shared/components';
import { Wishlist } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/_wishlist-card.scss';

interface WishlistCardProps {
  className?: string;
  wishlist: Wishlist;
  onAddItemToWishList?: (wishlistId: string) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, onAddItemToWishList = null, className = '' }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('common');

  const handleArticleClick = useCallback(() => {
    langNavigate(`/wishlists/${wishlist._id}`);
  }, [wishlist._id, langNavigate]);

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
      className={`${className}   wishlist-card ${onAddItemToWishList ? 'wishlist-card--interactive' : ''}`}
    >
      <div className="wishlist-card__content">
        <div className="wishlist-card__header">
          <small className="wishlist-card__count">
            {wishlist?.items?.length || 0} {wishlist?.items?.length === 1 ? t('wishlists.item') : t('wishlists.items')}
          </small>
          <h3 className="wishlist-card__name">{wishlist.name}</h3>
        </div>
        {onAddItemToWishList && (
          <Button className="wishlist-card__button" onClick={handleButtonClick}>
            {t('wishlists.add_to')} {wishlist.name}
          </Button>
        )}
      </div>
    </article>
  );
};
