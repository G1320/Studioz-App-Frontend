import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudio } from '../../../hooks/dataFetching/useStudio';
import ItemsList from '../items/itemsList';
import Button from '../../common/buttons/genericButton';
import { getLocalUser } from '../../../services/user-service';
import { useAddStudioToWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import WishlistPreview from '../wishlists/wishlistPreview';
import StudioPreview from './studioPreview';
import { Item,  Wishlist } from '../../../types/index';

interface StudioDetailsProps {
  items: Item[];
}

const StudioDetails: React.FC<StudioDetailsProps> = ({ items }) => {
  const navigate = useNavigate();
  const user = getLocalUser();
  const { studioId } = useParams();

  const { data: studioObj } = useStudio(studioId||'');
  const { data: wishlists = [] } = useWishlists(user?._id||'');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId||'');

  useEffect(() => {
    if (studioObj && studioObj.currStudio && items) {
      const filtered = items.filter((item) =>
      studioObj.currStudio.items.some((studioItem) => studioItem.itemId === item._id)
      );
      setFilteredItems(filtered);
    }
  }, [studioObj, items]);

  const handleAddItemToWishlist = async (wishlistId:string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleGoToEdit = (studioId:string) => (studioId ? navigate(`/edit-studio/${studioId}`) : null);
  const handlePagination = (nextId:string) => (nextId ? navigate(`/studio/${nextId}`) : null);


  const dropdownRenderItem = (wishlist:Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <section className="details studio-details">
      <StudioPreview studio={studioObj?.currStudio || null} />

      <div>
        <section className="details-buttons item-details-buttons">
          <div>
          <Button onClick={() => handleGoToEdit(studioObj?.currStudio?._id||'')}>Edit</Button>
          <Button onClick={() => handlePagination(studioObj?.prevStudio?._id||'')}>Prev</Button>
          <Button onClick={() => handlePagination(studioObj?.nextStudio?._id||'')}>Next</Button>
          </div>
          <div>
          <GenericMuiDropdown
            data={wishlists}
            renderItem={dropdownRenderItem}
            className="item-details-wishlists-dropdown add-button"
            title="Add to Wishlist"
            />
          {user && (
            <Button className='add-button'
            onClick={() =>
              navigate(`/create-item/${studioObj?.currStudio.name}/${studioObj?.currStudio._id}`)
            }
            >
              Add new Service
            </Button>
          )}
          </div>
        </section>
      </div>
      <ItemsList items={filteredItems} className="studio-items-list" />
    </section>
  );
};

export default StudioDetails;
