import '../styles/_index.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ItemsList } from '@features/entities/items/components/ItemsList';
import { StudiosList } from '@features/entities/studios/components/StudiosList';
import { useStudios, useWishlist } from '@shared/hooks';
import { Item, Studio, WishlistItem } from 'src/types/index';
import { getLocalUser } from '@shared/services';

interface WishlistDetailsPageProps {
  items?: Item[] | null;
}

const WishlistDetailsPage: React.FC<WishlistDetailsPageProps> = ({ items = null }) => {
  const { wishlistId } = useParams();

  const user = getLocalUser();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);

  const { data: studios = [] } = useStudios();
  const { data: wishlistObj } = useWishlist(user?._id || '', wishlistId || '');

  const { currWishlist } = wishlistObj || {};

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
      {filteredStudios.length > 0 && <StudiosList studios={filteredStudios} />}
    </section>
  );
};
export default WishlistDetailsPage;
