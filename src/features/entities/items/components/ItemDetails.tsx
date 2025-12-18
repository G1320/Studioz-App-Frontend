import { useCallback, useMemo, useState } from 'react';
import { ReservationDetailsForm, ItemHeader, HourSelector, BookingActions, ItemCard } from '@features/entities';
import { MuiDateTimePicker, SwipeableContainer } from '@shared/components';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { ReservationCard } from '@features/entities/reservations';
import { AddOnsList } from '@features/entities/addOns/components';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { useAddOns } from '@shared/hooks';

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

  const { closeModal } = useModal();

  const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.language === 'he';

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

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleIncrement = () => {
    setSelectedQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddOnToggle = useCallback((addOn: AddOn) => {
    setSelectedAddOnIds((prev) => {
      if (prev.includes(addOn._id)) {
        // Remove add-on if already selected
        return prev.filter((id) => id !== addOn._id);
      } else {
        // Add add-on if not selected
        return [...prev, addOn._id];
      }
    });
  }, []);

  const handleBookNow = useCallback(() => {
    const confirmedDate = selectedDate?.toString() || null;
    const hours = selectedQuantity;

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
    setCurrentReservationId,
    setSelectedDate,
    selectedAddOnIds,
    addOnsTotal
  ]);

  const handleGoToEdit = (itemId: string) => (itemId ? langNavigate(`/edit-item/${itemId}`) : null);
  const handleImageClicked = () => langNavigate(`/studio/${item?.studioId}`);

  return (
    <SwipeableContainer
      direction="down"
      onSwipe={closeModal}
      threshold={100}
      velocityThreshold={0.5}
      axis="y"
      maxDistance={300}
      showFeedback={true}
      swipeOpacity={0.5}
      className="item-details-wrapper"
    >
      <article onMouseEnter={prefetchItem} key={item?._id} className={`details item-details `}>
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
        <ItemCard item={item as Item} />
        {currentReservationId && reservation && (
          <ReservationCard
            reservation={reservation}
            variant="itemCard"
            onCancel={() => {
              localStorage.removeItem(`reservation_${itemId}`);
              setCurrentReservationId(null);
            }}
          />
        )}
        <div className="date-picker-row">
          {!currentReservationId && (
            <>
              <MuiDateTimePicker
                value={selectedDate}
                onChange={handleDateChange}
                itemAvailability={item?.availability || []}
                studioAvailability={studio?.studioAvailability}
              />

              <fieldset className="hours-fieldset">
                <legend className="hours-legend">{t('hours', 'Hours')}</legend>
                <HourSelector value={selectedQuantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
              </fieldset>
            </>
          )}
        </div>
        {isFeatureEnabled('addOns') && !currentReservationId && addOns.length > 0 && (
          <section className="item-addons-section">
            <AddOnsList addOns={addOns} showAddButton onAdd={handleAddOnToggle} selectedAddOnIds={selectedAddOnIds} />
          </section>
        )}
        {!currentReservationId && (
          <ReservationDetailsForm
            customerName={customerName}
            customerPhone={customerPhone}
            comment={comment}
            onNameChange={(value) => {
              localStorage.setItem('customerName', value);
              setCustomerName(value);
            }}
            onPhoneChange={(value) => {
              if (value !== customerPhone) {
                localStorage.removeItem('isPhoneVerified');
                setIsPhoneVerified(false);
              }
              localStorage.setItem('customerPhone', value);
              setCustomerPhone(value);
            }}
            onCommentChange={setComment}
            isRTL={isRTL}
            onPhoneVerified={() => {
              localStorage.setItem('isPhoneVerified', 'true');
              setIsPhoneVerified(true);
            }}
          />
        )}
        <BookingActions
          price={item?.price || 0}
          quantity={selectedQuantity}
          currentReservationId={currentReservationId}
          isPhoneVerified={isPhoneVerified}
          isBooked={isBooked as boolean}
          cart={cart}
          onBookNow={handleBookNow}
          addOnsTotal={addOnsTotal}
        />
      </article>
    </SwipeableContainer>
  );
};
