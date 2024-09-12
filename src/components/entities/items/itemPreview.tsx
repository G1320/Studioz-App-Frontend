import React, { MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';
import {
  useAddItemToCartMutation,
  useAddItemToWishlistMutation,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation,
} from '../../../hooks/index';

import WishlistPreview from '../wishlists/wishlistPreview';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import { useUserContext } from '../../../contexts/UserContext';
import { Item, Wishlist } from '../../../types/index';

interface ItemPreviewProps {
  item: Item;
  wishlists?: Wishlist[]; 
}

const ItemPreview: React.FC<ItemPreviewProps> = ({ item, wishlists = [] }) => {
  const { studioId, wishlistId } = useParams<{ studioId: string; wishlistId: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const addItemToCartMutation = useAddItemToCartMutation();
  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleAddItemToCart = () => addItemToCartMutation.mutate(item._id);
  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item._id);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);

  const handleArticleClicked = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).nodeName !== 'BUTTON') {
      navigate(`/item/${item._id}`);
    }
  };

  const renderItem = (wishlist: Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <article onClick={handleArticleClicked} key={item._id} className="preview item-preview">
      <div className='title-availability-container'>
        <h2>{item.name}</h2>
        <div className='availability-container'>
        {item.inStock && <small>In Stock</small>}
        <small>${item.price}</small>
        </div>
      </div>
      <small>{item.studioName}</small>
      <p>{item.description}</p>

      {wishlistId ? (
        <Button
          className="remove-from-wishlist-button"
          onClick={handleRemoveItemFromWishlist}
        >
          Remove from Wishlist
        </Button>
      ) : user?._id  && ( 
        <GenericMuiDropdown
          data={wishlists}
          renderItem={renderItem}
          className="item-details-wishlists-dropdown"
          title="Add to Wishlist"
        />
      )}

      {studioId && user?.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio">
          Remove from Studio
        </Button>
      )}

      <Button className="add-to-cart-button" onClick={handleAddItemToCart}>
        Add to Cart
      </Button>
    </article>
  );
};

export default ItemPreview;
