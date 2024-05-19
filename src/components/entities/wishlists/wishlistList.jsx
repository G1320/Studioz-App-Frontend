import React from 'react';
import { Link } from 'react-router-dom';
import GenericList from '../../common/lists/genericList';
import WishlistPreview from './wishlistPreview';
import GenericMultiDropdownEntryPreview from '../../common/lists/genericMultiDropdownEntryPreview';
import { getLocalUser } from '../../../services/user-service.js';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists.js';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';

const WishlistList = ({ isDropdown = false, isMultiSelect = false }) => {
  const user = getLocalUser();

  const { data: wishlists } = useWishlists(user?._id);

  const renderItem = isMultiSelect
    ? (wishlist) => <GenericMultiDropdownEntryPreview entry={wishlist} key={wishlist._id} />
    : (wishlist) => <WishlistPreview wishlist={wishlist} key={wishlist._id} />;

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
