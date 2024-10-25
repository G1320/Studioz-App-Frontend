import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  GenericMuiDropdown,
  WishlistPreview,
  StudioPreview,
  GenericCarousel,
  ItemPreview
} from '@/components/index';
import { useStudio, useAddStudioToWishlistMutation, useWishlists } from '@/hooks/index';
import { Item, Wishlist } from '@/types/index';
import { useUserContext } from '@/contexts/index';
import { toast } from 'sonner';
import { usePrefetchStudio } from '@/hooks/prefetching/index';

interface StudioDetailsPageProps {
  items: Item[];
}

const StudioDetailsPage: React.FC<StudioDetailsPageProps> = ({ items }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { studioId } = useParams();

  const { data: studioObj } = useStudio(studioId || '');
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { currStudio, nextStudio, prevStudio } = studioObj || {};

  const prefetchStudio = usePrefetchStudio(nextStudio?._id || '');

  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId || '');

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  const handleAddItemToWishlist = async (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handlePagination = (nextId: string) =>
    nextId ? navigate(`/studio/${nextId}`) : toast.error('No more studios');
  const handleGoToEdit = (studioId: string) => (studioId ? navigate(`/edit-studio/${studioId}`) : null);

  const dropdownRenderItem = (wishlist: Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  const getStudioServicesDisplayName = (name: string) => (name?.length > 1 ? `${name}'s Services` : '');

  return (
    <section className="details studio-details-page">
      <StudioPreview studio={currStudio} />
      <div>
        <div className="studio-details-options-container">
          <section className="details-buttons item-details-buttons">
            <div>
              {currStudio && user?._id === currStudio?.createdBy && (
                <Button onClick={() => handleGoToEdit(currStudio?._id || '')}>Edit</Button>
              )}
              <Button onMouseEnter={prefetchStudio} onClick={() => handlePagination(prevStudio?._id || '')}>
                Prev
              </Button>
              <Button onMouseEnter={prefetchStudio} onClick={() => handlePagination(nextStudio?._id || '')}>
                Next
              </Button>
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
                  {user?._id === currStudio?.createdBy && (
                    <Button
                      className="add-button"
                      onClick={() => navigate(`/create-item/${currStudio?.name}/${currStudio?._id}`)}
                    >
                      Add new Service
                    </Button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
      <GenericCarousel
        title={(() => getStudioServicesDisplayName(currStudio?.name || ''))()}
        autoplay={true}
        data={filteredItems}
        renderItem={(item) => <ItemPreview item={item} />}
      />
    </section>
  );
};
export default StudioDetailsPage;
