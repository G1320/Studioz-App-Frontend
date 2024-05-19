import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';
import { useItem } from '../../../hooks/dataFetching/useItem';
import {
  useAddItemToWishlistMutation,
  useDeleteItemMutation,
} from '../../../hooks/mutations/items/itemMutations';
import { getLocalUser } from '../../../services/user-service';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import WishlistPreview from '../wishlists/wishlistPreview';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import ItemPreview from './itemPreview';

const ItemDetails = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { data: item } = useItem(itemId);
  const { data: wishlists } = useWishlists(user?._id);

  const deleteItemMutation = useDeleteItemMutation();
  const addItemToWishlistMutation = useAddItemToWishlistMutation(itemId);

  const handleAddItemToWishlist = async (wishlistId) => addItemToWishlistMutation.mutate(wishlistId);
  const handleEditBtnClicked = () => navigate(`/edit-item/${itemId}`);

  const handleDeleteBtnClicked = async () => {
    deleteItemMutation.mutate(itemId);
    navigate('/store');
  };

  const renderItem = (wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist?._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist?._id)}
    />
  );

  return (
    <section className=" item-details">
      <ItemPreview item={item} />
      <section className="details-buttons item-details-buttons">
        <Button onClick={handleDeleteBtnClicked}>Del</Button>
        <Button onClick={handleEditBtnClicked}>Edit</Button>
        <GenericMuiDropdown
          data={wishlists}
          renderItem={renderItem}
          className="item-details-wishlists-dropdown"
          title="Wishlists"
        />
      </section>
    </section>
  );
};

export default ItemDetails;
