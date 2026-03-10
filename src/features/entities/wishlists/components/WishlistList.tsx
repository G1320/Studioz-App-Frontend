import { Link } from 'react-router-dom';
import { WishlistCard } from './WishlistCard';
import { GenericList, GenericMultiDropdownEntryCard, GenericMuiDropdown, Button } from '@shared/components';
import { getLocalUser } from '@shared/services';
import { useWishlists } from '@shared/hooks';
import { Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { AddIcon, FavoriteBorderIcon } from '@shared/components/icons';

interface WishlistListProps {
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

export const WishlistList: React.FC<WishlistListProps> = ({ isDropdown = false, isMultiSelect = false }) => {
  const user = getLocalUser();
  const { i18n, t } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const renderItem = (wishlist: Wishlist) =>
    isMultiSelect ? (
      <GenericMultiDropdownEntryCard entry={wishlist} key={wishlist?._id} />
    ) : (
      <WishlistCard wishlist={wishlist} key={wishlist?._id} />
    );

  const handleCreateWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    langNavigate('/create-wishlist');
  };

  const emptyState = (
    <Button onClick={handleCreateWishlist} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}>
      <AddIcon style={{ marginRight: '0.5rem' }} />
      {t('wishlists.create_new')}
    </Button>
  );

  const hasWishlists = wishlists.length > 0;

  return (
    <section className="wishlists">
      <div className="wishlists-header">
        <h1 className="wishlists-title">{t('wishlists.my_wishlists')}</h1>
        <p className="wishlists-subtitle">
          {hasWishlists
            ? `${wishlists.length} ${wishlists.length === 1 ? t('wishlists.wishlist') : t('wishlists.wishlists')} ${t('wishlists.saved')}`
            : t('wishlists.create_and_organize')}
        </p>
      </div>

      {hasWishlists && (
        <Link to={`/${i18n.language}/create-wishlist`} className="create-wishlist-button">
          <AddIcon />
          <span>{t('wishlists.create_new')}</span>
        </Link>
      )}

      {isDropdown ? (
        <GenericMuiDropdown
          data={wishlists}
          renderItem={renderItem}
          className="wishlist-list"
          title={t('navigation.wishlists')}
          emptyState={emptyState}
        />
      ) : hasWishlists ? (
        <GenericList data={wishlists} renderItem={renderItem} className="wishlist-list" />
      ) : (
        <div className="wishlists-empty">
          <div className="wishlists-empty__icon">
            <FavoriteBorderIcon />
          </div>
          <h2 className="wishlists-empty__title">{t('wishlists.empty_title')}</h2>
          <p className="wishlists-empty__description">{t('wishlists.empty_description')}</p>
          <Link to={`/${i18n.language}/create-wishlist`} className="create-wishlist-button">
            <AddIcon />
            <span>{t('wishlists.create_new')}</span>
          </Link>
        </div>
      )}
    </section>
  );
};
