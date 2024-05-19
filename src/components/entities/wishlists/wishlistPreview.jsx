import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';

const WishlistPreview = ({ wishlist, onAddItemToWishList = null }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/wishlists/${wishlist._id}`)}
      key={wishlist._id}
      className="preview wishlist-preview"
    >
      <h3>{wishlist.name}</h3>
      <div>
        <small>{wishlist.items.length} Items</small>
        <small>{wishlist.studios.length} Studios</small>
      </div>
      {onAddItemToWishList && (
        <Button onClick={() => onAddItemToWishList(wishlist._id)}>Add to {wishlist.name}</Button>
      )}
    </article>
  );
};

export default WishlistPreview;
