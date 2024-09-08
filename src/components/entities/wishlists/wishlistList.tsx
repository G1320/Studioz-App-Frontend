import React from 'react';
import { Link } from 'react-router-dom';
import GenericList from '../../common/lists/genericList';
import WishlistPreview from './wishlistPreview';
import GenericMultiDropdownEntryPreview from '../../common/lists/genericMultiDropdownEntryPreview';
import { getLocalUser } from '../../../services/user-service';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import { Wishlist } from '../../../types/index';

interface WishlistListProps {
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

const WishlistList: React.FC<WishlistListProps> = ({ isDropdown = false, isMultiSelect = false }) => {
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
