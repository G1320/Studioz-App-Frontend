import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, GenericMuiDropdown, ItemsList, WishlistPreview, StudioPreview } from '@/components';
import { useStudio, useAddStudioToWishlistMutation,useWishlists } from '@/hooks/index';
import { getLocalUser } from '@/services';
import { Item, Wishlist } from '@/types/index';
import { toast } from 'sonner';

interface StudioDetailsProps {
  items: Item[];
}

 export const StudioDetails: React.FC<StudioDetailsProps> = ({ items }) => {
  const navigate = useNavigate();
  const user = getLocalUser();
  const { studioId } = useParams();

  const { data: studioObj } = useStudio(studioId ||'');
  const { data: wishlists = [] } = useWishlists(user?._id ||'');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId ||'');

  useEffect(() => {
    if (studioObj && studioObj.currStudio && items) {
      const filtered = items.filter((item) =>
      studioObj.currStudio.items.some((studioItem) => studioItem.itemId === item._id)
      );
      setFilteredItems(filtered);
    }
  }, [studioObj, items]);

  const handleAddItemToWishlist = async (wishlistId:string) =>  addItemToWishlistMutation.mutate(wishlistId);
  const handlePagination = (nextId:string) => (nextId ? navigate(`/studio/${nextId}`) : toast.error('No more studios'));
  const handleGoToEdit = (studioId:string) => (studioId ? navigate(`/edit-studio/${studioId}`) : null);


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
          { user?._id === studioObj?.currStudio.createdBy && (
            <Button onClick={() => handleGoToEdit(studioObj?.currStudio?._id||'')}>Edit</Button>
            )}
          <Button onClick={() => handlePagination(studioObj?.prevStudio?._id||'')}>Prev</Button>
          <Button onClick={() => handlePagination(studioObj?.nextStudio?._id||'')}>Next</Button>
          </div>
          <div>
          {user && (
            <>
            <GenericMuiDropdown
            data={wishlists}
            renderItem={dropdownRenderItem}
            className="item-details-wishlists-dropdown add-button"
            title="Add to Wishlist"
            />
            { user?._id === studioObj?.currStudio.createdBy && (
              <Button className='add-button'
              onClick={() =>
                navigate(`/create-item/${studioObj?.currStudio.name}/${studioObj?.currStudio._id}`)
              }
              >
              Add new Service
            </Button>
              )}
              </>
          )}
          </div>
        </section>
      </div>
      <ItemsList items={filteredItems} className="studio-items-list" />
    </section>
  );
};

export default StudioDetails;
