import { MouseEvent, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  GenericMuiDropdown,
  WishlistPreview,
  MuiDateTimePicker,
  MuiDateTimePickerRef
} from '@components/index';
import {
  useAddItemToCartMutation,
  useAddItemToWishlistMutation,
  useLanguageNavigate,
  useRemoveItemFromStudioMutation,
  useRemoveItemFromWishlistMutation
} from '@hooks/index';
import { useUserContext } from '@contexts/index';
import { Item, Wishlist } from 'src/types/index';
import { usePrefetchItem } from '@hooks/prefetching/index';
import { splitDateTime } from '@utils/index';
import { useReserveStudioItemTimeSlotsMutation } from '@hooks/mutations/bookings/bookingMutations';
import { useTranslation } from 'react-i18next';
interface ItemPreviewProps {
  item: Item;
  wishlists?: Wishlist[];
}

export const ItemPreview: React.FC<ItemPreviewProps> = ({ item, wishlists = [] }) => {
  const { studioId, wishlistId } = useParams();
  const langNavigate = useLanguageNavigate();
  const { user } = useUserContext();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t } = useTranslation('common');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<MuiDateTimePickerRef>(null);

  const addItemToCartMutation = useAddItemToCartMutation();
  const reserveItemTimeSlotMutation = useReserveStudioItemTimeSlotsMutation(item._id);
  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');
  const removeItemFromStudioMutation = useRemoveItemFromStudioMutation(studioId || '');

  const handleBookNow = () => {
    if (isDatePickerOpen) return handleDatePickerClose();

    setIsDatePickerOpen(true);
    if (datePickerRef.current) {
      datePickerRef.current.open();
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleDateConfirm = (confirmedDate: string | null, hours: number) => {
    const { bookingDate, startTime } = splitDateTime(confirmedDate || '');
    if (!bookingDate || !startTime) return;
    const newItem = {
      name: item.name,
      price: item.price || 0,
      total: (item.price || 0) * hours,
      itemId: item._id,
      bookingDate,
      startTime,
      studioName: item.studioName,
      studioImgUrl: item.studioImgUrl,
      hours
    };

    reserveItemTimeSlotMutation.mutate(newItem, {
      onSuccess: () => {
        addItemToCartMutation.mutate(newItem);
        setIsDatePickerOpen(false);
        setSelectedDate(null);
      },
      onError: (error) => {
        console.error('Booking failed:', error);

        if (datePickerRef.current) {
          datePickerRef.current.reopen();
        }
      }
    });
  };

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);
  const handleRemoveItemFromStudio = () => removeItemFromStudioMutation.mutate(item._id);

  const handleArticleClicked = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).nodeName !== 'BUTTON') {
      langNavigate(`/item/${item._id}`);
    }
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
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
      <h3>{item.name}</h3>
      <div>
        <h3>{item.studioName}</h3>
        <div>
          <small>₪{item.price}/hr</small>
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
            title={t('buttons.add_to_wishlist')}
          />
        )
      )}

      {studioId && user?.isAdmin && (
        <Button onClick={handleRemoveItemFromStudio} className="remove-from-studio-button">
          Remove from Studio
        </Button>
      )}
      <div className="book-now-date-picker-container" onClick={handleDatePickerClick}>
        <Button className="add-to-cart-button book-now-button" onClick={handleBookNow}>
          {t('buttons.add_to_cart')}
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
