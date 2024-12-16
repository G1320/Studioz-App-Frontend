import { Link } from 'react-router-dom';
import { WishlistPreview, GenericList, GenericMultiDropdownEntryPreview, GenericMuiDropdown } from '@components/index';
import { getLocalUser } from '@services/index';
import { useWishlists } from '@hooks/index';
import { Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface WishlistListProps {
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

export const WishlistList: React.FC<WishlistListProps> = ({ isDropdown = false, isMultiSelect = false }) => {
  const user = getLocalUser();
  const { i18n } = useTranslation();

  const { data: wishlists = [] } = useWishlists(user?._id || '');

  console.log('isMultiSelect: ', isMultiSelect);
  const renderItem = (wishlist: Wishlist) =>
    isMultiSelect ? (
      <GenericMultiDropdownEntryPreview entry={wishlist} key={wishlist?._id} />
    ) : (
      <WishlistPreview wishlist={wishlist} key={wishlist?._id} />
    );

  return (
    <section className="wishlists">
      <h1>
        <Link to={`/${i18n.language}/create-wishlist`}>Create wishlist</Link>
      </h1>
      {isDropdown ? (
        <GenericMuiDropdown data={wishlists} renderItem={renderItem} className="wishlist-list" title="wishlists" />
      ) : (
        <GenericList data={wishlists} renderItem={renderItem} className="wishlist-list" />
      )}
    </section>
  );
};
