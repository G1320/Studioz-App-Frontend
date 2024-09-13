import { useNavigate, useParams } from 'react-router-dom';
import { ItemPreview, WishlistPreview, Button, GenericMuiDropdown } from '@/components';
import { useItem, useWishlists, useAddItemToWishlistMutation, useDeleteItemMutation } from '@/hooks';
import { getLocalUser } from '@/services';
import { Wishlist } from '@/types/index';

  export const ItemDetails: React.FC = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { itemId } = useParams(); 
  const { data: item } = useItem(itemId || '');
  const { data: wishlists } = useWishlists(user?._id || '');

  const deleteItemMutation = useDeleteItemMutation();
  const addItemToWishlistMutation = useAddItemToWishlistMutation(itemId||'');

  const handleAddItemToWishlist = async (wishlistId: string) => {
    if (wishlistId)  addItemToWishlistMutation.mutate(wishlistId);
  };

  const handleEditBtnClicked = () => {
    if (itemId) navigate(`/edit-item/${itemId}`);
  };

  const handleDeleteBtnClicked = async () => {
    if (itemId) deleteItemMutation.mutate(itemId);
  };

  const renderItem = (wishlist: Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <section className="item-details">
  {item ? (
        <ItemPreview item={item} wishlists={wishlists || []} />
      ) : (
        <p>Loading...</p>
      )} <section className="details-buttons item-details-buttons">
        <div>
        <Button onClick={handleDeleteBtnClicked}>Del</Button>
        <Button onClick={handleEditBtnClicked}>Edit</Button>
        <GenericMuiDropdown
          data={wishlists || []}
          renderItem={renderItem}
          className="item-details-wishlists-dropdown"
          title="Wishlists"
          />
          </div>
      </section>
    </section>
  );
};

export default ItemDetails;
