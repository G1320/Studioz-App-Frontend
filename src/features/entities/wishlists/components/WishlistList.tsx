import { Link } from 'react-router-dom';
import { WishlistCard } from '@features/entities';
import { GenericList, GenericMultiDropdownEntryCard, GenericMuiDropdown, Button } from '@shared/components';
import { getLocalUser } from '@shared/services';
import { useWishlists } from '@shared/hooks';
import { Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { AddIcon } from '@shared/components/icons';

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

  return (
    <section className="wishlists">
      <div className="wishlists-header">
        <div className="wishlists-title-section"></div>
        <p className="wishlists-subtitle">
          {wishlists.length === 0
            ? t('wishlists.create_and_organize')
            : `${wishlists.length} ${wishlists.length === 1 ? t('wishlists.wishlist') : t('wishlists.wishlists')} ${t('wishlists.saved')}`}
        </p>
      </div>
      <Link to={`/${i18n.language}/create-wishlist`} className="create-wishlist-button">
        <AddIcon />
        <span>{t('wishlists.create_new')}</span>
      </Link>
      {isDropdown ? (
        <GenericMuiDropdown
          data={wishlists}
          renderItem={renderItem}
          className="wishlist-list"
          title={t('navigation.wishlists')}
          emptyState={emptyState}
        />
      ) : (
        <GenericList data={wishlists} renderItem={renderItem} className="wishlist-list" />
      )}
    </section>
  );
};
