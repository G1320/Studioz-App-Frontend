import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReservationDetailsForm, ItemHeader, HourSelector, BookingActions } from '@features/entities';
import { MuiDateTimePicker } from '@shared/components';
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
import { User, Wishlist } from 'src/types/index';
import { splitDateTime } from '@shared/utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { ReservationCard } from '@features/entities/reservations';

interface ItemDetailsProps {
  itemId: string;
  wishlists?: Wishlist[];
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ itemId }) => {
  const { user } = useUserContext();
  const { data: item } = useItem(itemId);
  const { data: data } = useStudio(item?.studioId || '');
  const { data: cart } = useCart(user?._id || '');
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

  // Fetch reservation data when we have a reservation ID
  const { data: reservation } = useReservation(currentReservationId || '');

  const isBooked = useMemo(() => cart?.items.some((cartItem) => cartItem.itemId === item?._id), [cart, item]);

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
        total: (item?.price || 0) * hours,
        itemId: item?._id,
        studioId: studio._id,
        bookingDate,
        startTime,
        studioImgUrl: item?.studioImgUrl,
        hours,
        customerName,
        customerPhone,
        costumerId: user?._id,
        comment
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
    setSelectedDate
  ]);

  useEffect(() => {
    if (currentReservationId) {
      const timer = setTimeout(
        () => {
          localStorage.removeItem(`reservation_${itemId}`);
          setCurrentReservationId(null);
        },
        15 * 60 * 1000
      ); // 15 minutes

      return () => clearTimeout(timer);
    }
  }, [currentReservationId, itemId]);

  const handleGoToEdit = (itemId: string) => (itemId ? langNavigate(`/edit-item/${itemId}`) : null);
  const handleImageClicked = () => langNavigate(`/studio/${item?.studioId}`);

  return (
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
          <MuiDateTimePicker
            value={selectedDate}
            onChange={handleDateChange}
            itemAvailability={item?.availability || []}
            studioAvailability={studio?.studioAvailability}
          />
        )}
        {!currentReservationId && (
          <fieldset className="hours-fieldset">
            <legend className="hours-legend">{t('hours', 'Hours')}</legend>
            <HourSelector value={selectedQuantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
          </fieldset>
        )}
      </div>

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
      />
    </article>
  );
};
