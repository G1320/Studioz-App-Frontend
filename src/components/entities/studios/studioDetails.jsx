import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudio } from '../../../hooks/dataFetching/useStudio';
import ItemPreview from '../items/itemPreview';
import ItemsList from '../items/itemsList';
import Button from '../../common/buttons/genericButton';
import { getLocalUser } from '../../../services/user-service';
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

  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId);

  useEffect(() => {
    if (studioObj && studioObj.currStudio && items) {
      const filtered = items.filter((item) =>
        studioObj.currStudio.items.some((studioItem) => studioItem.itemId === item._id)
      );
      setFilteredItems(filtered);
    }
  }, [studioObj, items]);

  const handleAddItemToWishlist = async (wishlistId) => addItemToWishlistMutation.mutate(wishlistId);

  const handleGoToEdit = (studioId) => (studioId ? navigate(`/edit-studio/${studioId}`) : null);

  const renderItem = (item) => <ItemPreview item={item} key={item._id} />;

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
