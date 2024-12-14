import { Button, GenericMuiDropdown, WishlistPreview } from '@components/index';
import { Studio, User, Wishlist } from 'src/types/index';

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
  onEdit,
  onAddNewService,
  onAddToWishlist
}) => {
  const dropdownRenderItem = (wishlist: Wishlist) => (
    <WishlistPreview wishlist={wishlist} key={wishlist._id} onAddItemToWishList={() => onAddToWishlist(wishlist._id)} />
  );

  return (
    <section className="studio-details-options-container">
      <div className="details-buttons studio-details-buttons">
        <div>
          {currStudio && user?._id === currStudio?.createdBy && (
            <div>
              <Button onClick={() => onEdit(currStudio?._id || '')}>Edit</Button>
              <Button className="add-button" onClick={() => onAddNewService(currStudio?._id || '')}>
                Add new Service
              </Button>
            </div>
          )}
        </div>
        <div>
          {user && (
            <div>
              <GenericMuiDropdown
                data={wishlists}
                renderItem={dropdownRenderItem}
                className="studio-details-wishlists-dropdown add-button"
                title="Add to Wishlist"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioOptions;
