import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';

import {
  useAddItemToWishlistMutation,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation,
} from '../../../hooks/mutations/items/itemMutations';
import WishlistPreview from '../wishlists/wishlistPreview';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import { useUserContext } from '../../../contexts/UserContext';

const ItemPreview = ({ item, onAddItemToCart, wishlists }) => {
  const navigate = useNavigate();
  const user = useUserContext();
  const { studioId, wishlistId } = useParams();

  const AddItemToWishlistMutation = useAddItemToWishlistMutation(item?._id);
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId);

  const handleAddItemToWishlist = async (wishlistId) => AddItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromStudio = async () => removeItemFromStudioMutation.mutate(item?._id);
  const handleRemoveItemFromWishlist = async (itemId) => removeItemFromWishlistMutation.mutate(itemId);

  const handleClick = (e) => {
    const target = e.target;
    if (target.nodeName !== 'BUTTON') {
      navigate(`/item/${item._id}`);
    }
  };

  const renderItem = (wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist?._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist?._id)}
    />
  );

  return (
    <article onClick={handleClick} key={item?._id} className="preview item-preview">
      <div>
        <h2>{item?.name}</h2>
        {item?.inStock && <small>In Stock</small>}
        <small>${item?.price}</small>
      </div>
      <small>{item?.studioName}</small>
      <p>{item?.description}</p>
      <GenericMuiDropdown
        data={wishlists}
        renderItem={renderItem}
        className="item-details-wishlists-dropdown"
        title="Add to Wishlist"
      />

      {wishlistId && (
        <Button
          className="add-to-wishlist-button"
          onClick={() => handleRemoveItemFromWishlist(item?._id)}
        >
          Remove from Wishlist
        </Button>
      )}

      {studioId && user.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio">
          Remove from Studio
        </Button>
      )}

      {onAddItemToCart && (
        <Button className="add-to-cart-button" onClick={() => onAddItemToCart(item?._id)}>
          Add to Cart{' '}
        </Button>
      )}
    </article>
  );
};

export default ItemPreview;
