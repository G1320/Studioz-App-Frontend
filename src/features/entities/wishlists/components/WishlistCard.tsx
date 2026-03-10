import { Button } from '@shared/components';
import { Wishlist } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FavoriteIcon, ChevronRightIcon, ChevronLeftIcon } from '@shared/components/icons';
import '../styles/_wishlist-card.scss';

interface WishlistCardProps {
  className?: string;
  wishlist: Wishlist;
  onAddItemToWishList?: (wishlistId: string) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, onAddItemToWishList = null, className = '' }) => {
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.dir() === 'rtl';

  const itemCount = wishlist?.items?.length || 0;
  const studioCount = wishlist?.studios?.length || 0;

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
      className={`${className} wishlist-card ${onAddItemToWishList ? 'wishlist-card--interactive' : ''}`}
    >
      <div className="wishlist-card__icon-area">
        <FavoriteIcon />
      </div>
      <div className="wishlist-card__content">
        <h3 className="wishlist-card__name">{wishlist.name}</h3>
        <div className="wishlist-card__meta">
          <span className="wishlist-card__count">
            {itemCount} {itemCount === 1 ? t('wishlists.item') : t('wishlists.items')}
          </span>
          {studioCount > 0 && (
            <>
              <span className="wishlist-card__separator" />
              <span className="wishlist-card__count">
                {studioCount} {studioCount === 1 ? t('wishlists.studios_count') : t('wishlists.studios_count_plural')}
              </span>
            </>
          )}
        </div>
        {onAddItemToWishList && (
          <Button className="wishlist-card__button" onClick={handleButtonClick}>
            {t('wishlists.add_to')} {wishlist.name}
          </Button>
        )}
      </div>
      {!onAddItemToWishList && (
        <div className="wishlist-card__arrow">
          {isRtl ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </div>
      )}
    </article>
  );
};
