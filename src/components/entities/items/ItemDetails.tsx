import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  GenericMuiDropdown,
  WishlistPreview,
  MuiDateTimePicker,
  ContinueToCheckoutButton
} from '@components/index';
import {
  useAddItemToCartMutation,
  useAddItemToWishlistMutation,
  useLanguageNavigate,
  useRemoveItemFromWishlistMutation
} from '@hooks/index';
import { useUserContext } from '@contexts/index';
import { Cart, Item, Studio, User, Wishlist } from 'src/types/index';
import { usePrefetchItem } from '@hooks/prefetching/index';
import { splitDateTime } from '@utils/index';
import { useReserveStudioItemTimeSlotsMutation } from '@hooks/mutations/bookings/bookingMutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import ItemOptions from './ItemOptions';
interface ItemDetailsProps {
  cart?: Cart;
  item: Item;
  studio?: Studio;
  wishlists?: Wishlist[];
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ item, cart, studio, wishlists = [] }) => {
  const { wishlistId } = useParams();
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { t } = useTranslation('common');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const isBooked = useMemo(() => cart?.items.some((cartItem) => cartItem.itemId === item._id), [cart, item]);

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

    const closingTime = studio?.studioAvailability?.times[0]?.end;
    if (!closingTime) return toast.error('Studio closing time is unavailable');

    const startDateTime = dayjs(`${bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endDateTime = startDateTime.add(hours, 'hour');
    const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

    if (endDateTime.isAfter(closingDateTime)) {
      return toast.error('Selected hours exceed the studio closing time. Please adjust your booking.');
    }

    const newItem = {
      name: {
        en: item.name.en,
        he: item.name.he
      },
      studioName: {
        en: item.studioName?.en || '',
        he: item.studioName?.he
      },
      price: item.price || 0,
      total: (item.price || 0) * hours,
      itemId: item._id,
      studioId: studio._id,
      bookingDate,
      startTime,
      studioImgUrl: item.studioImgUrl,
      hours
    };

    reserveItemTimeSlotMutation.mutate(newItem, {
      onSuccess: () => {
        addItemToCartMutation.mutate(newItem);
        setSelectedDate(null);
        langNavigate(`/studio/${studio?._id}`);
      }
    });
  };

  const handleAddItemToWishlist = (wishlistId: string) => addItemToWishlistMutation.mutate(wishlistId);
  const handleRemoveItemFromWishlist = () => removeItemFromWishlistMutation.mutate(item._id);
  const handleGoToEdit = (itemId: string) => (itemId ? langNavigate(`/edit-item/${itemId}`) : null);

  const handleImageClicked = () => {
    langNavigate(`/studio/${item.studioId}`);
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
      <div>
        <h3>{item.studioName.en}</h3>
        <ItemOptions item={item} user={user as User} onEdit={handleGoToEdit} />
      </div>
      <div className="item-info-container">
        <h3>{item.name.en}</h3>
        <small className="item-price">₪{item.price}/hr</small>
      </div>
      <p>{item.description.en}</p>
      <div className="hour-selection-container">
        <div>
          <span className="hour-label"> Hours:</span>
          <span className="hour-value">{selectedHours}</span>
        </div>
        <div className="button-group">
          <button className="control-button minus" onClick={handleDecrement}>
            −
          </button>
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
        studioAvailability={studio?.studioAvailability}
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
      {!isBooked ? (
        <Button
          className="add-to-cart-button book-now-button"
          onClick={() => handleDateConfirm(selectedDate?.toString() || null, selectedHours)}
        >
          {t('buttons.add_to_cart')}
        </Button>
      ) : (
        cart && <ContinueToCheckoutButton cart={cart} />
      )}
    </article>
  );
};
