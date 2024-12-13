import { Button, GenericMuiDropdown, WishlistPreview } from '@components/index';
import { Studio, User, Wishlist } from 'src/types/index';
import { usePrefetchStudio } from '@hooks/prefetching/index';
import { toast } from 'sonner';
import { useLanguageNavigate } from '@hooks/index';

interface StudioOptionsProps {
  currStudio: Studio;
  user: User;
  wishlists: Wishlist[];
  nextStudioId?: string;
  prevStudioId?: string;
  onEdit: (studioId: string) => void;
  onAddNewService: (studioId: string) => void;
  onAddToWishlist: (wishlistId: string) => void;
}

const StudioOptions: React.FC<StudioOptionsProps> = ({
  currStudio,
  user,
  wishlists,
  nextStudioId,
  prevStudioId,
  onEdit,
  onAddNewService,
  onAddToWishlist
}) => {
  const prefetchStudio = usePrefetchStudio(nextStudioId || '');
  const langNavigate = useLanguageNavigate();

  const handlePagination = (nextId: string) =>
    nextId ? langNavigate(`/studio/${nextId}`) : toast.error('No more studios');

  const dropdownRenderItem = (wishlist: Wishlist) => (
    <WishlistPreview wishlist={wishlist} key={wishlist._id} onAddItemToWishList={() => onAddToWishlist(wishlist._id)} />
  );

  return (
    <section className="studio-details-options-container">
      <div className="details-buttons item-details-buttons">
        <div>
          {currStudio && user?._id === currStudio?.createdBy && (
            <Button onClick={() => onEdit(currStudio?._id || '')}>Edit</Button>
          )}
          <Button onMouseEnter={prefetchStudio} onClick={() => handlePagination(prevStudioId || '')}>
            Prev
          </Button>
          <Button onMouseEnter={prefetchStudio} onClick={() => handlePagination(nextStudioId || '')}>
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
                <Button className="add-button" onClick={() => onAddNewService(currStudio?._id || '')}>
                  Add new Service
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioOptions;
