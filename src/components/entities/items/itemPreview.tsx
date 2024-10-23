import { MouseEvent, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, GenericMuiDropdown, WishlistPreview, MuiDateTimePicker, MuiDateTimePickerRef } from '@/components';
import {
  useAddItemToCartMutation,
  useAddItemToWishlistMutation,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation
} from '@/hooks';
import { useUserContext } from '@/contexts';
import { Item, Wishlist } from '@/types/index';
import { usePrefetchItem } from '@/hooks/prefetching/index';
import { splitDateTime } from '@/utils';
import { bookItem } from '@/services/booking-service';
interface ItemPreviewProps {
  item: Item;
  wishlists?: Wishlist[];
}

export const ItemPreview: React.FC<ItemPreviewProps> = ({ item, wishlists = [] }) => {
  const { studioId, wishlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const prefetchItem = usePrefetchItem(item?._id || '');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<MuiDateTimePickerRef>(null);

  const addItemToCartMutation = useAddItemToCartMutation();
  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleBookNow = () => {
    if (isDatePickerOpen) return setIsDatePickerOpen(false);
    setIsDatePickerOpen(true);
    if (datePickerRef.current) {
      datePickerRef.current.open();
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleDateConfirm = (confirmedDate: string | null) => {
    const { bookingDate, startTime } = splitDateTime(confirmedDate || '');
    if (bookingDate && startTime) {
      const newItem = {
        name: item.name,
        price: item.price || 0,
        total: item.price || 0,
        itemId: item._id,
        bookingDate: bookingDate,
        startTime: startTime,
        studioName: item.studioName,
        studioImgUrl: item.studioImgUrl
      };

      addItemToCartMutation.mutate(newItem);
      bookItem(newItem, user?._id || '');

      setIsDatePickerOpen(false);
      setSelectedDate(null);
    }
  };

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item._id);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);

  const handleArticleClicked = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).nodeName !== 'BUTTON') {
      navigate(`/item/${item._id}`);
    }
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false); // Close the picker on cancel, ESC, or clicking outside
  };

  const renderItem = (wishlist: Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <article onMouseEnter={prefetchItem} onClick={handleArticleClicked} key={item._id} className="preview item-preview">
      <h2>{item.name}</h2>
      <div>
        <h3>{item.studioName}</h3>
        <div className="">
          {item.inStock && <small>In Stock</small>}
          <small>${item.price}/hr</small>
        </div>
      </div>
      <p>{item.description}</p>

      {wishlistId ? (
        <Button className="remove-from-wishlist-button" onClick={handleRemoveItemFromWishlist}>
          Remove from Wishlist
        </Button>
      ) : (
        user?._id && (
          <GenericMuiDropdown
            data={wishlists}
            renderItem={renderItem}
            className="item-details-wishlists-dropdown"
            title="Add to Wishlist"
          />
        )
      )}

      {studioId && user?.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio">
          Remove from Studio
        </Button>
      )}

      <div className="book-now-date-picker-container" onClick={handleDatePickerClick}>
        <Button className="add-to-cart-button book-now-button" onClick={handleBookNow}>
          Book Now
        </Button>

        <MuiDateTimePicker
          ref={datePickerRef}
          label="Select Booking Date and Time"
          value={selectedDate}
          onChange={handleDateChange}
          onAccept={handleDateConfirm}
          open={isDatePickerOpen}
          onClose={handleDatePickerClose}
          availability={item.availability}
        />
      </div>
    </article>
  );
};

export default ItemPreview;
