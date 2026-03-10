import '../styles/_index.scss';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ItemsList } from '@features/entities/items/components/ItemsList';
import { StudiosList } from '@features/entities/studios/components/StudiosList';
import { useStudios, useWishlist } from '@shared/hooks';
import { Item, Studio, WishlistItem } from 'src/types/index';
import { getLocalUser } from '@shared/services';
import { useTranslation } from 'react-i18next';
import { ArrowBackIcon, ArrowForwardIcon, FavoriteBorderIcon } from '@shared/components/icons';

interface WishlistDetailsPageProps {
  items?: Item[] | null;
}

const WishlistDetailsPage: React.FC<WishlistDetailsPageProps> = ({ items = null }) => {
  const { wishlistId } = useParams();
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.dir() === 'rtl';

  const user = getLocalUser();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);

  const { data: studios = [] } = useStudios();
  const { data: wishlistObj } = useWishlist(user?._id || '', wishlistId || '');

  const { currWishlist } = wishlistObj || {};

  useEffect(() => {
    if (wishlistObj && currWishlist && items && studios) {
      const filteredItems = items?.filter((item) =>
        currWishlist?.items?.some((wishlistItem: WishlistItem) => wishlistItem.itemId === item._id)
      );

      const filteredStudios = studios.filter((studio) =>
        currWishlist?.studios?.some((wishlistStudio) => wishlistStudio === studio._id)
      );

      setFilteredItems(filteredItems);
      setFilteredStudios(filteredStudios);
    }
  }, [wishlistObj, currWishlist, items, studios]);

  const isEmpty = filteredItems.length === 0 && filteredStudios.length === 0;
  const totalCount = filteredItems.length + filteredStudios.length;

  return (
    <section className="wishlist-details-page">
      <div className="wishlist-details-page__header">
        <Link to={`/${i18n.language}/wishlists`} className="wishlist-details-page__back">
          {isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          <span>{t('wishlists.back_to_wishlists')}</span>
        </Link>
        <div className="wishlist-details-page__title-row">
          <h1 className="wishlist-details-page__title">{currWishlist?.name}</h1>
          {!isEmpty && (
            <span className="wishlist-details-page__count">
              {totalCount} {totalCount === 1 ? t('wishlists.item') : t('wishlists.items')}
            </span>
          )}
        </div>
        {currWishlist?.description && (
          <p className="wishlist-details-page__description">{currWishlist.description}</p>
        )}
      </div>

      {isEmpty ? (
        <div className="wishlist-details-page__empty">
          <div className="wishlist-details-page__empty-icon">
            <FavoriteBorderIcon />
          </div>
          <h2>{t('wishlists.empty_wishlist')}</h2>
          <p>{t('wishlists.empty_wishlist_description')}</p>
        </div>
      ) : (
        <div className="wishlist-details-page__content">
          {filteredItems.length > 0 && <ItemsList items={filteredItems} className="wishlist-items-list" />}
          {filteredStudios.length > 0 && <StudiosList studios={filteredStudios} />}
        </div>
      )}
    </section>
  );
};
export default WishlistDetailsPage;
