import { GenericCarousel } from '@components/common';
import { StudioDetails, ContinueToCheckoutButton, ItemPreview } from '@components/index';
import StudioOptions from '@components/entities/studios/StudioOptions'; // Adjust the path as needed
import { useUserContext } from '@contexts/UserContext';
import { useStudio, useWishlists } from '@hooks/dataFetching';
import { useAddStudioToWishlistMutation } from '@hooks/mutations';
import { useLanguageNavigate } from '@hooks/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cart, Item, Studio, User } from 'src/types/index';

interface StudioDetailsPageProps {
  items: Item[];
  cart: Cart;
}

const StudioDetailsPage: React.FC<StudioDetailsPageProps> = ({ items, cart }) => {
  const langNavigate = useLanguageNavigate();
  const { user } = useUserContext();
  const { studioId } = useParams();

  const { data: studioObj } = useStudio(studioId || '');
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { currStudio, nextStudio, prevStudio } = studioObj || {};

  const addItemToWishlistMutation = useAddStudioToWishlistMutation(studioId || '');

  useEffect(() => {
    if (studioObj && currStudio && items) {
      const filtered = items.filter((item) => currStudio.items.some((studioItem) => studioItem.itemId === item._id));
      setFilteredItems(filtered);
    }
  }, [studioObj, currStudio, items]);

  const handleAddToWishlist = async (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleGoToEdit = (studioId: string) => (studioId ? langNavigate(`/edit-studio/${studioId}`) : null);
  const handleAddNewService = (studioId: string) =>
    studioId ? langNavigate(`/create-item/${currStudio?.name}/${studioId}`) : null;

  const getStudioServicesDisplayName = (name: string) => (name?.length > 1 ? `${name}'s Services` : '');

  return (
    <section className="details studio-details-page">
      <StudioDetails studio={currStudio} />
      <StudioOptions
        currStudio={currStudio as Studio}
        user={user as User}
        wishlists={wishlists}
        nextStudioId={nextStudio?._id}
        prevStudioId={prevStudio?._id}
        onEdit={handleGoToEdit}
        onAddNewService={handleAddNewService}
        onAddToWishlist={handleAddToWishlist}
      />
      <GenericCarousel
        title={(() => getStudioServicesDisplayName(currStudio?.name || ''))()}
        data={filteredItems}
        renderItem={(item) => <ItemPreview item={item} />}
      />
      <ContinueToCheckoutButton cart={cart} />
    </section>
  );
};

export default StudioDetailsPage;
