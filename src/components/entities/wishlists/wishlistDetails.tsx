import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';
import { getLocalUser } from '../../../services/user-service';
import { useWishlist } from '../../../hooks/dataFetching/useWishlist';
import { useStudios } from '../../../hooks/dataFetching/useStudios';
import ItemsList from '../items/itemsList';
import { useAddItemsToCartMutation } from '../../../hooks/mutations/cart/cartMutations';
import { toast } from 'sonner';
import { useDeleteWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';
import StudiosList from '../studios/studiosList';
import { Item, Studio, WishlistItem } from '../../../types/index';

interface WishlistDetailsProps {
  items?: Item[] | null;
}

const WishlistDetails: React.FC<WishlistDetailsProps> = ({ items = null }) => {
  const { wishlistId } = useParams();
  
  const navigate = useNavigate();
  const user = getLocalUser();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);

  const { data: studios = [] } = useStudios();
  const { data: wishlistObj  } = useWishlist(user?._id ||'', wishlistId || '');
  const addItemsToCartMutation = useAddItemsToCartMutation();
  const deleteUserWishlistMutation = useDeleteWishlistMutation(user?._id || '');

  const handlePagination = (nextId:string) => (nextId ? navigate(`/wishlists/${nextId}`) : null);
  const handleGoToEdit = (wishlistId:string) => (wishlistId ? navigate(`/edit-wishlist/${wishlistId}`) : null);

  const handleAddWishlistItemsToCart = (wishlistItems:WishlistItem[]) => {
    if (wishlistItems.length === 0) return toast.error('No items to add to cart');

    const wishlistItemsIds = wishlistItems.map((wishlistItem) => wishlistItem.itemId);
    addItemsToCartMutation.mutate({items: wishlistItemsIds});
    deleteUserWishlistMutation.mutate(wishlistId || '');
    navigate('/cart');
  };

  useEffect(() => {
    if (wishlistObj && wishlistObj?.currWishlist && items && studios) {
      // Filter items based on itemIds which are also present in the current wishlist
      const filteredItems = items?.filter((item) =>
      wishlistObj.currWishlist?.items?.some((wishlistItem:WishlistItem) => wishlistItem.itemId === item._id)
      );
      
      // Filter studios based on studioIds which are also present in the current wishlist
      const filteredStudios = studios.filter((studio) =>
        wishlistObj.currWishlist?.studios?.some((wishlistStudio) => wishlistStudio === studio._id)
      );

      setFilteredItems(filteredItems );
      setFilteredStudios(filteredStudios);
    }
  }, [wishlistObj, items, studios]);

  return (
    <section className="details wishlist-details">
      <h1>{wishlistObj?.currWishlist?.name}</h1>
      <section className="details-buttons wishlist-details-buttons">
        <Button onClick={() => handleGoToEdit(wishlistObj?.currWishlist?._id||'')}>Edit</Button>
        <Button onClick={() => handlePagination(wishlistObj?.prevWishlist?._id||'')}>Prev</Button>
        <Button onClick={() => handlePagination(wishlistObj?.nextWishlist?._id||'')}>Next</Button>
        <Button onClick={() => handleAddWishlistItemsToCart(wishlistObj?.currWishlist?.items||[])}>
          Add to Cart
        </Button>
      </section>

      {filteredItems.length > 0 && <ItemsList items={filteredItems} />}

      {filteredStudios && filteredStudios.length > 0 ? <StudiosList studios={filteredStudios} /> : null}
    </section>
  );
};

export default WishlistDetails;
