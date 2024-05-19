import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudio } from '../../../hooks/dataFetching/useStudio';
import ItemPreview from '../items/itemPreview';
import ItemsList from '../items/itemsList';
import Button from '../../common/buttons/genericButton';
import {
  useAddItemToCartMutation,
  useAddItemsToCartMutation,
} from '../../../hooks/mutations/cart/cartMutations';
import { getLocalUser } from '../../../services/user-service';
import { toast } from 'sonner';
import { useAddStudioToWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import WishlistPreview from '../wishlists/wishlistPreview';
import StudioPreview from './studioPreview';

const StudioDetails = ({ items = null }) => {
  const navigate = useNavigate();
  const user = getLocalUser();
  const { studioId } = useParams();

  const [filteredItems, setFilteredItems] = useState([]);
  const { data: studioObj } = useStudio(studioId);
  const { data: wishlists } = useWishlists(user?._id);

  const addItemToCartMutation = useAddItemToCartMutation(user?._id);
  const addItemsToCartMutation = useAddItemsToCartMutation(user?._id);
  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId);

  useEffect(() => {
    if (studioObj && studioObj.currStudio && items) {
      const filtered = items.filter((item) =>
        studioObj.currStudio.items.some((studioItem) => studioItem.itemId === item._id)
      );
      setFilteredItems(filtered);
    }
  }, [studioObj, items]);

  const handleAddItemToCart = (item) => addItemToCartMutation.mutate(item);

  const handleAddStudioItemsToCart = (currStudioItems) => {
    if (currStudioItems.length === 0) return toast.error('No items to add to cart');
    const studioItemsIds = currStudioItems.map((studioItem) => studioItem.itemId);
    addItemsToCartMutation.mutate(studioItemsIds);
  };

  const handleAddItemToWishlist = async (wishlistId) => addItemToWishlistMutation.mutate(wishlistId);

  // const handlePagination = (nextId) => (nextId ? navigate(`/studios/${nextId}`) : null);
  const handleGoToEdit = (studioId) => (studioId ? navigate(`/edit-studio/${studioId}`) : null);

  const renderItem = (item) => (
    <ItemPreview item={item} key={item._id} onAddItemToCart={handleAddItemToCart} />
  );

  const dropdownRenderItem = (wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <section className="details studio-details">
      <StudioPreview studio={studioObj?.currStudio} />
      <div>
        <section className="details-buttons item-details-buttons">
          <GenericMuiDropdown
            data={wishlists}
            renderItem={dropdownRenderItem}
            className="item-details-wishlists-dropdown"
            title="Add to Wishlist"
          />
          <Button onClick={() => handleGoToEdit(studioObj?.currStudio?._id)}>Edit</Button>
          {/* <Button onClick={() => handlePagination(studioObj?.prevStudio?._id)}>Prev</Button>
          <Button onClick={() => handlePagination(studioObj?.nextStudio?._id)}>Next</Button> */}
          {/* <Button
            className="add-to-cart-button"
            onClick={() => handleAddStudioItemsToCart(studioObj?.currStudio?.items)}
          >
            Add to Cart
          </Button> */}
          {user && (
            <Button
              onClick={() =>
                navigate(`/create-item/${studioObj?.currStudio.name}/${studioObj?.currStudio._id}`)
              }
            >
              Add new Service
            </Button>
          )}
        </section>
      </div>
      <ItemsList items={filteredItems} renderItem={renderItem} className="studio-items-list" />
    </section>
  );
};

export default StudioDetails;
