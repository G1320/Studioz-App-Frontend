import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, GenericMuiDropdown, WishlistPreview, MuiDateTimePicker } from '@components/index';
import {
  useAddItemToCartMutation,
  useAddItemToWishlistMutation,
  useLanguageNavigate,
  useRemoveItemFromWishlistMutation,
  useStudio
} from '@hooks/index';
import { useUserContext } from '@contexts/index';
import { Item, Studio, Wishlist } from 'src/types/index';
import { usePrefetchItem } from '@hooks/prefetching/index';
import { splitDateTime } from '@utils/index';
import { useReserveStudioItemTimeSlotsMutation } from '@hooks/mutations/bookings/bookingMutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
interface ItemDetailsProps {
  item: Item;
  studio?: Studio;
  wishlists?: Wishlist[];
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ item, studio, wishlists = [] }) => {
  const { wishlistId } = useParams();
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t } = useTranslation('common');

  const { data: studioObj } = useStudio(item?.studioId || '');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(0);

  const reserveItemTimeSlotMutation = useReserveStudioItemTimeSlotsMutation(item._id);
  const addItemToCartMutation = useAddItemToCartMutation();
  const addItemToWishlistMutation = useAddItemToWishlistMutation(item._id);
  const removeItemFromWishlistMutation = useRemoveItemFromWishlistMutation(wishlistId || '');

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleIncrement = () => {
    setSelectedHours((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSelectedHours((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleDateConfirm = (confirmedDate: string | null, hours: number) => {
    const { bookingDate, startTime } = splitDateTime(confirmedDate || '');
    if (!bookingDate || !startTime) return toast.error('Please select a valid date and time');
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
        setSelectedDate(null);
        langNavigate('/cart');
      },
      onError: (error) => {
        console.error('Booking failed:', error);
      }
    });
  };

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);

  const handleImageClicked = () => {
    langNavigate(`/studio/${item.studioId}`);
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderItem = (wishlist: Wishlist) => (
    <WishlistPreview
      wishlist={wishlist}
      key={wishlist._id}
      onAddItemToWishList={() => handleAddItemToWishlist(wishlist._id)}
    />
  );

  return (
    <article onMouseEnter={prefetchItem} key={item._id} className="details item-details">
      {studio && <img className="cover-image" src={studio.coverImage} onClick={handleImageClicked} />}
      <h3>{item.studioName}</h3>
      <div className="item-info-container">
        <h3>{item.name}</h3>
        <small className="item-price">₪{item.price}/hr</small>
      </div>
      <p>{item.description}</p>
      <div className="hour-selection-container">
        <span className="hour-label"> Hours:</span>
        <div className="button-group">
          <button className="control-button minus" onClick={handleDecrement}>
            −
          </button>
          <span className="hour-value">{selectedHours}</span>
          <button className="control-button plus" onClick={handleIncrement}>
            +
          </button>
        </div>
      </div>
      <MuiDateTimePicker
        label="Select Date and Start Time"
        value={selectedDate}
        onChange={handleDateChange}
        availability={item.availability}
        studioAvailability={studioObj?.currStudio.studioAvailability}
      />
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

      <div className="book-now-date-picker-container" onClick={handleDatePickerClick}>
        <Button
          className="add-to-cart-button book-now-button"
          onClick={() => handleDateConfirm(selectedDate?.toString() || null, selectedHours)}
        >
          {t('buttons.add_to_cart')}
        </Button>
      </div>
    </article>
  );
};
