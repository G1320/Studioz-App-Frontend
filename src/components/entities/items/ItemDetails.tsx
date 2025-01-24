import { useCallback, useMemo, useState } from 'react';
import { CustomerDetailsForm, ItemHeader, HourSelector, BookingActions } from '@components/index';
import { MuiDateTimePicker } from '@shared/components';
import { useAddItemToCartMutation, useItem, useLanguageNavigate, useStudio } from '@shared/hooks/index';
import { useModal, useUserContext } from '@core/contexts';
import { Cart, User, Wishlist } from 'src/types/index';
import { usePrefetchItem, useReserveStudioItemTimeSlotsMutation } from '@shared/hooks/index';
import { splitDateTime } from '@shared/utils/index';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { ReservationDetails } from '../reservations/ReservationsDetails';

interface ItemDetailsProps {
  cart?: Cart;
  itemId: string;
  wishlists?: Wishlist[];
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ itemId, cart }) => {
  const { user } = useUserContext();
  const { data: item } = useItem(itemId);
  const { data: data } = useStudio(item?.studioId || '');
  const studio = data?.currStudio;

  const { closeModal } = useModal();

  const langNavigate = useLanguageNavigate();
  const prefetchItem = usePrefetchItem(item?._id || '');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const [costumerPhone, setCostumerPhone] = useState(() => localStorage.getItem('customerPhone') || '');
  const [costumerName, setCostumerName] = useState(() => localStorage.getItem('customerName') || '');
  const [comment, setComment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isExiting, setIsExiting] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState<string | null>(() => {
    return localStorage.getItem(`reservation_${itemId}`) || null;
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(() => localStorage.getItem('isPhoneVerified') === 'true');

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
        costumerName,
        costumerPhone,
        costumerId: user?._id,
        comment
      };

      reserveItemTimeSlotMutation.mutate(newItem, {
        onSuccess: (response) => {
          // Save to localStorage when setting new reservation
          localStorage.setItem(`reservation_${itemId}`, response);
          setCurrentReservationId(response);
          addItemToCartMutation.mutate({ ...newItem, reservationId: response });
          setIsExiting(true);
          setTimeout(() => {
            setSelectedDate(null);
            langNavigate(`/studio/${studio?._id}`);
          }, 250);
        }
      });
    }
  };

  const handleGoToEdit = (itemId: string) => (itemId ? langNavigate(`/edit-item/${itemId}`) : null);
  const handleImageClicked = () => langNavigate(`/studio/${item?.studioId}`);

  // const showDatePicker = useMemo(() => {
  //   return !currentReservationId && !isExiting && (item?.pricePer === 'hour' || item?.pricePer === 'session');
  // }, [currentReservationId, isExiting, item?.pricePer]);

  const handleBookNow = useCallback(() => {
    handleDateConfirm(selectedDate?.toString() || null, selectedQuantity);
  }, [selectedDate, selectedQuantity]);

  return (
    <article
      onMouseEnter={prefetchItem}
      key={item?._id}
      className={`details item-details ${isExiting ? 'exiting' : ''}`}
    >
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

      {currentReservationId && (
        <ReservationDetails reservationId={currentReservationId} pricePer={item?.pricePer as string} />
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
          <HourSelector value={selectedQuantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
        )}
      </div>

      {!currentReservationId && (
        <CustomerDetailsForm
          costumerName={costumerName}
          costumerPhone={costumerPhone}
          comment={comment}
          onNameChange={(value) => {
            localStorage.setItem('customerName', value);
            setCostumerName(value);
          }}
          onPhoneChange={(value) => {
            if (value !== costumerPhone) {
              localStorage.removeItem('isPhoneVerified');
              setIsPhoneVerified(false);
            }
            localStorage.setItem('customerPhone', value);
            setCostumerPhone(value);
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
