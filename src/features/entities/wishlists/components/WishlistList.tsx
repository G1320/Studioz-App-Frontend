import { Link } from 'react-router-dom';
import { WishlistPreview } from '@features/entities';
import { GenericList, GenericMultiDropdownEntryPreview, GenericMuiDropdown } from '@shared/components';
import { getLocalUser } from '@shared/services';
import { useWishlists } from '@shared/hooks';
import { Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

interface WishlistListProps {
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

export const WishlistList: React.FC<WishlistListProps> = ({ isDropdown = false, isMultiSelect = false }) => {
  const user = getLocalUser();
  const { i18n } = useTranslation();

  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const renderItem = (wishlist: Wishlist) =>
    isMultiSelect ? (
      <GenericMultiDropdownEntryPreview entry={wishlist} key={wishlist?._id} />
    ) : (
      <WishlistPreview wishlist={wishlist} key={wishlist?._id} />
    );

  return (
    <section className="wishlists">
      <div className="wishlists-header">
        <div className="wishlists-title-section"></div>
        <p className="wishlists-subtitle">
          {wishlists.length === 0
            ? 'Create and organize your favorite studios and services'
            : `${wishlists.length} ${wishlists.length === 1 ? 'wishlist' : 'wishlists'} saved`}
        </p>
      </div>
      <Link to={`/${i18n.language}/create-wishlist`} className="create-wishlist-button">
        <AddIcon />
        <span>Create New Wishlist</span>
      </Link>
      {isDropdown ? (
        <GenericMuiDropdown data={wishlists} renderItem={renderItem} className="wishlist-list" title="wishlists" />
      ) : (
        <GenericList data={wishlists} renderItem={renderItem} className="wishlist-list" />
      )}
    </section>
  );
};
