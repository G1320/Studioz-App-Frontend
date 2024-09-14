import { Link } from 'react-router-dom';
import { WishlistPreview, GenericList, GenericMultiDropdownEntryPreview, GenericMuiDropdown } from '@/components';
import { getLocalUser } from '@/services';
import { useWishlists } from '@/hooks/index';
import { Wishlist } from '@/types/index';

interface WishlistListProps {
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

 export const WishlistList: React.FC<WishlistListProps> = ({ isDropdown = false, isMultiSelect = false }) => {
  const user = getLocalUser();

  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const renderItem = (wishlist:Wishlist) => isMultiSelect
    ? <GenericMultiDropdownEntryPreview entry={wishlist} key={wishlist?._id} />
    : <WishlistPreview wishlist={wishlist} key={wishlist?._id} />;

  return (
    <section className="wishlists">
      <Link to="/create-wishlist">Create wishlist</Link>
      {isDropdown ? (
        <GenericMuiDropdown
          data={wishlists}
          renderItem={renderItem}
          className="wishlist-list"
          title="wishlists"
        />
      ) : (
        <GenericList data={wishlists} renderItem={renderItem} className="wishlist-list" />
      )}
    </section>
  );
};

export default WishlistList;
