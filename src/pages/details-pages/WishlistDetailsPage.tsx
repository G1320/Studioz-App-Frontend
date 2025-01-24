import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ItemsList, StudiosList } from '@components/index';
import { Button } from '@shared/components';
import {
  useStudios,
  useWishlist,
  //  useAddItemsToCartMutation,
  useDeleteWishlistMutation,
  useLanguageNavigate
} from '@shared/hooks/index';
import { Item, Studio, WishlistItem } from 'src/types/index';
import { getLocalUser } from '@shared/services/index';
import { toast } from 'sonner';

interface WishlistDetailsPageProps {
  items?: Item[] | null;
}

const WishlistDetailsPage: React.FC<WishlistDetailsPageProps> = ({ items = null }) => {
  const { wishlistId } = useParams();

  const langNavigate = useLanguageNavigate();
  const user = getLocalUser();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);

  const { data: studios = [] } = useStudios();
  const { data: wishlistObj } = useWishlist(user?._id || '', wishlistId || '');

  const { currWishlist, nextWishlist, prevWishlist } = wishlistObj || {};

  // const addItemsToCartMutation = useAddItemsToCartMutation();
  const deleteUserWishlistMutation = useDeleteWishlistMutation(user?._id || '');

  const handlePagination = (nextId: string) =>
    nextId ? langNavigate(`/wishlists/${nextId}`) : toast.error('No more wishlists');
  const handleGoToEdit = (wishlistId: string) => (wishlistId ? langNavigate(`/edit-wishlist/${wishlistId}`) : null);

  const handleAddWishlistItemsToCart = (wishlistItems: WishlistItem[]) => {
    if (wishlistItems.length === 0) return toast.error('No items to add to cart');

    // const wishlistItemsIds = wishlistItems.map((wishlistItem) => wishlistItem.itemId);
    // addItemsToCartMutation.mutate({items: wishlistItemsIds});
    deleteUserWishlistMutation.mutate(wishlistId || '');
    langNavigate('/cart');
  };

  useEffect(() => {
    if (wishlistObj && currWishlist && items && studios) {
      // Filter items based on itemIds which are also present in the current wishlist
      const filteredItems = items?.filter((item) =>
        currWishlist?.items?.some((wishlistItem: WishlistItem) => wishlistItem.itemId === item._id)
      );

      // Filter studios based on studioIds which are also present in the current wishlist
      const filteredStudios = studios.filter((studio) =>
        currWishlist?.studios?.some((wishlistStudio) => wishlistStudio === studio._id)
      );

      setFilteredItems(filteredItems);
      setFilteredStudios(filteredStudios);
    }
  }, [wishlistObj, currWishlist, items, studios]);

  return (
    <section className="details wishlist-details-page">
      <h1>{currWishlist?.name}</h1>

      {filteredItems.length > 0 && <ItemsList items={filteredItems} className="wishlist-items-list" />}
      <div className="details-buttons wishlist-details-buttons">
        <Button onClick={() => handleGoToEdit(currWishlist?._id || '')}>Edit</Button>
        <Button onClick={() => handlePagination(prevWishlist?._id || '')}>Prev</Button>
        <Button onClick={() => handlePagination(nextWishlist?._id || '')}>Next</Button>
        <Button onClick={() => handleAddWishlistItemsToCart(currWishlist?.items || [])}>Add to Cart</Button>
      </div>

      {filteredStudios && filteredStudios.length > 0 ? <StudiosList studios={filteredStudios} /> : null}
    </section>
  );
};
export default WishlistDetailsPage;
