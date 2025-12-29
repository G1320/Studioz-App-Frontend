import { useCallback, useMemo, useState } from 'react';
import { ItemHeader, ItemCard, ItemContent } from '@features/entities';
import {
  useAddItemToCartMutation,
  useItem,
  useStudio,
  useCart,
  useLanguageNavigate,
  usePrefetchItem,
  useReserveStudioItemTimeSlotsMutation,
  useReservation
} from '@shared/hooks';
import { useModal, useUserContext } from '@core/contexts';
import { User, Wishlist, AddOn, Item } from 'src/types/index';
import { splitDateTime } from '@shared/utils';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useAddOns } from '@shared/hooks';
import { useTranslation } from 'react-i18next';

interface ItemDetailsProps {
  itemId: string;
  wishlists?: Wishlist[];
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ itemId }) => {
  const { user } = useUserContext();
  const { data: item } = useItem(itemId);
  const { data: data } = useStudio(item?.studioId || '');
  const { data: cart } = useCart(user?._id || '');
  const { data: addOns = [] } = useAddOns(itemId);
  const studio = data?.currStudio;
  const { t } = useTranslation('common');

  const { closeModal } = useModal();

  const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');

  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('customerPhone') || '');
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('customerName') || '');
  const [comment, setComment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [currentReservationId, setCurrentReservationId] = useState<string | null>(() => {
    return localStorage.getItem(`reservation_${itemId}`) || null;
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(() => localStorage.getItem('isPhoneVerified') === 'true');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Fetch reservation data when we have a reservation ID
  const { data: reservation } = useReservation(currentReservationId || '');

  const isBooked = useMemo(() => cart?.items.some((cartItem) => cartItem.itemId === item?._id), [cart, item]);

  // Calculate total add-on price based on selected add-ons and quantity
  const addOnsTotal = useMemo(() => {
    if (!selectedAddOnIds.length || !addOns.length) return 0;

    return selectedAddOnIds.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a._id === addOnId);
      if (!addOn || !addOn.price) return total;

      // If pricePer is "hour", multiply by quantity (hours)
      if (addOn.pricePer === 'hour') {
        return total + addOn.price * selectedQuantity;
      }
      // For "session", "song", "unit", add once
      return total + addOn.price;
    }, 0);
  }, [selectedAddOnIds, addOns, selectedQuantity]);

  const reserveItemTimeSlotMutation = useReserveStudioItemTimeSlotsMutation(item?._id || '');
  const addItemToCartMutation = useAddItemToCartMutation();

  const handleDateChange = useCallback((newDate: Date | null) => {
    setSelectedDate(newDate);
  }, []);

  const handleIncrement = useCallback(() => {
    setSelectedQuantity((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleAddOnToggle = useCallback((addOn: AddOn) => {
    setSelectedAddOnIds((prev) => {
      if (prev.includes(addOn._id)) {
        return prev.filter((id) => id !== addOn._id);
      } else {
        return [...prev, addOn._id];
      }
    });
  }, []);

  const handleNameChange = useCallback((value: string) => {
    localStorage.setItem('customerName', value);
    setCustomerName(value);
  }, []);

  const handlePhoneChange = useCallback(
    (value: string) => {
      if (value !== customerPhone) {
        localStorage.removeItem('isPhoneVerified');
        setIsPhoneVerified(false);
      }
      localStorage.setItem('customerPhone', value);
      setCustomerPhone(value);
    },
    [customerPhone]
  );

  const handlePhoneVerified = useCallback(() => {
    localStorage.setItem('isPhoneVerified', 'true');
    setIsPhoneVerified(true);
  }, []);

  const handleCancelReservation = useCallback(() => {
    localStorage.removeItem(`reservation_${itemId}`);
    setCurrentReservationId(null);
  }, [itemId]);

  const handleBookNow = useCallback(() => {
    const confirmedDate = selectedDate?.toString() || null;
    const hours = selectedQuantity;

    const { bookingDate, startTime } = splitDateTime(confirmedDate || '');
    if (!bookingDate || !startTime) return toast.error(t('toasts.error.selectDateTime'));

    const closingTime = studio?.studioAvailability?.times[0]?.end;
    if (!closingTime) return toast.error(t('toasts.error.closingTimeUnavailable'));

    const startDateTime = dayjs(`${bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endDateTime = startDateTime.add(hours, 'hour');
    const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

    if (endDateTime.isAfter(closingDateTime)) {
      return toast.error(t('toasts.error.hoursExceedClosing'));
    }

    if (item) {
      const itemTotal = (item?.price || 0) * hours;
      const totalWithAddOns = itemTotal + addOnsTotal;

      const newItem = {
        name: {
          en: item?.name?.en,
          he: item?.name?.he
        },
        studioName: {
          en: item?.studioName?.en,
          he: item?.studioName?.he
        },
        price: item?.price || 0,
        total: totalWithAddOns,
        itemId: item?._id,
        studioId: studio._id,
        bookingDate,
        startTime,
        studioImgUrl: item?.studioImgUrl,
        hours,
        customerName,
        customerPhone,
        customerId: user?._id,
        comment,
        addOnIds: selectedAddOnIds
      };

      reserveItemTimeSlotMutation.mutate(newItem, {
        onSuccess: (response) => {
          localStorage.setItem(`reservation_${itemId}`, response);
          setCurrentReservationId(response);
          addItemToCartMutation.mutate({ ...newItem, reservationId: response });
          setTimeout(() => {
            setSelectedDate(null);
          }, 250);
        }
      });
    }
  }, [
    selectedDate,
    selectedQuantity,
    studio,
    item,
    customerName,
    customerPhone,
    user?._id,
    comment,
    itemId,
    reserveItemTimeSlotMutation,
    addItemToCartMutation,
    selectedAddOnIds,
    addOnsTotal
  ]);

  const handleGoToEdit = useCallback(
    (itemId: string) => (itemId ? langNavigate(`/edit-item/${itemId}`) : null),
    [langNavigate]
  );
  const handleImageClicked = useCallback(
    () => langNavigate(`/studio/${item?.studioId}`),
    [langNavigate, item?.studioId]
  );

  return (
    <article onMouseEnter={prefetchItem} key={item?._id} className="details item-details">
      <button className="close-button" onClick={closeModal}>
        ×
      </button>
      <ItemHeader
        studio={studio}
        item={item}
        user={user as User}
        onEdit={handleGoToEdit}
        onImageClick={handleImageClicked}
      />
      <ItemCard item={item as Item} user={user as User} onEdit={handleGoToEdit} />
      <ItemContent
        item={item as Item}
        studio={studio}
        cart={cart}
        addOns={addOns}
        reservation={reservation}
        currentReservationId={currentReservationId}
        selectedDate={selectedDate}
        selectedQuantity={selectedQuantity}
        customerName={customerName}
        customerPhone={customerPhone}
        comment={comment}
        isPhoneVerified={isPhoneVerified}
        isBooked={isBooked as boolean}
        isLoading={reserveItemTimeSlotMutation.isPending}
        selectedAddOnIds={selectedAddOnIds}
        addOnsTotal={addOnsTotal}
        onDateChange={handleDateChange}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onAddOnToggle={handleAddOnToggle}
        onNameChange={handleNameChange}
        onPhoneChange={handlePhoneChange}
        onCommentChange={setComment}
        onPhoneVerified={handlePhoneVerified}
        onBookNow={handleBookNow}
        onCancelReservation={handleCancelReservation}
      />
    </article>
  );
};
