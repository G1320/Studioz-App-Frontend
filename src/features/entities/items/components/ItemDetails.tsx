import { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemHeader, ItemCard, ItemContent, OrderSummary } from '@features/entities';
import {
  useAddItemToCartMutation,
  useItem,
  useStudio,
  useCart,
  useLanguageNavigate,
  usePrefetchItem,
  useReserveStudioItemTimeSlotsMutation,
  useReservation,
  useSavedCards,
  useSavedCardsByPhone,
  useRemoveSavedCardMutation
} from '@shared/hooks';
import { useModal, useUserContext } from '@core/contexts';
import { User, Wishlist, AddOn, Item, CartItem } from 'src/types/index';
import { splitDateTime } from '@shared/utils';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useAddOns } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { getMinimumHours, getMaximumHours, AvailabilityContext } from '@shared/utils/availabilityUtils';
import i18n from '@core/i18n/config';

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

  // Saved cards for payment (must be after state declarations)
  // For logged-in users: fetch by userId
  // For non-logged-in users: fetch by verified phone number
  const { data: userSavedCards = [] } = useSavedCards(user?._id);
  const { data: phoneSavedCards = [] } = useSavedCardsByPhone(
    !user?._id && isPhoneVerified ? customerPhone : undefined
  );
  const savedCards = user?._id ? userSavedCards : phoneSavedCards;
  const removeSavedCardMutation = useRemoveSavedCardMutation(user?._id);

  // Payment step state
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [pendingBookingItem, setPendingBookingItem] = useState<CartItem | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');

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

  // Create availability context for calculations
  const availabilityContext = useMemo<AvailabilityContext | null>(() => {
    if (!item) return null;
    return { item, studio };
  }, [item, studio]);

  // Calculate min/max hours based on item constraints
  const minHours = useMemo(() => {
    return item ? getMinimumHours(item) : 1;
  }, [item]);

  const maxHours = useMemo(() => {
    if (!availabilityContext || !selectedDate) return undefined;
    const selectedDayjs = dayjs(selectedDate);
    const startSlot = selectedDayjs.format('HH:00');
    return getMaximumHours(startSlot, selectedDayjs, availabilityContext);
  }, [availabilityContext, selectedDate]);

  // Initialize quantity to minHours when item loads
  useEffect(() => {
    if (minHours > 1) {
      setSelectedQuantity(minHours);
    }
  }, [minHours]);

  // Clear selections when modal closes or item changes
  useEffect(() => {
    return () => {
      // Cleanup function runs when component unmounts (modal closes)
      setSelectedDate(null);
      setSelectedQuantity(1);
      setComment('');
      setSelectedAddOnIds([]);
      setShowPaymentStep(false);
      setPendingBookingItem(null);
      setPaymentError('');
    };
  }, [itemId]); // Re-run cleanup when itemId changes

  // Reset quantity to minimum when date changes, and clamp to valid range
  useEffect(() => {
    if (selectedDate && minHours) {
      setSelectedQuantity((prev) => {
        // Ensure quantity is at least minHours
        if (prev < minHours) return minHours;
        // Ensure quantity doesn't exceed maxHours
        if (maxHours !== undefined && prev > maxHours) return maxHours;
        return prev;
      });
    }
  }, [selectedDate, minHours, maxHours]);

  const handleDateChange = useCallback(
    (newDate: Date | null) => {
      setSelectedDate(newDate);
      // Reset quantity to minimum when date changes
      if (newDate && item) {
        const min = getMinimumHours(item);
        setSelectedQuantity(min);
      }
    },
    [item]
  );

  const handleIncrement = useCallback(() => {
    setSelectedQuantity((prev) => {
      const next = prev + 1;
      // Respect max hours if set
      if (maxHours !== undefined && next > maxHours) return prev;
      return next;
    });
  }, [maxHours]);

  const handleDecrement = useCallback(() => {
    setSelectedQuantity((prev) => (prev > minHours ? prev - 1 : minHours));
  }, [minHours]);

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

  // Prepare booking item data (shared between direct booking and payment flow)
  const prepareBookingItem = useCallback((): CartItem | null => {
    const confirmedDate = selectedDate?.toString() || null;
    const hours = selectedQuantity;

    const { bookingDate, startTime } = splitDateTime(confirmedDate || '');
    if (!bookingDate || !startTime) {
      toast.error(t('toasts.error.selectDateTime'));
      return null;
    }

    const closingTime = studio?.studioAvailability?.times[0]?.end;
    if (!closingTime) {
      toast.error(t('toasts.error.closingTimeUnavailable'));
      return null;
    }

    const startDateTime = dayjs(`${bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
    const endDateTime = startDateTime.add(hours, 'hour');
    const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

    if (endDateTime.isAfter(closingDateTime)) {
      toast.error(t('toasts.error.hoursExceedClosing'));
      return null;
    }

    if (!item) return null;

    const itemTotal = (item?.price || 0) * hours;
    const totalWithAddOns = itemTotal + addOnsTotal;

    return {
      name: {
        en: item?.name?.en || '',
        he: item?.name?.he
      },
      studioName: {
        en: item?.studioName?.en,
        he: item?.studioName?.he
      },
      price: item?.price || 0,
      total: totalWithAddOns,
      itemId: item?._id,
      studioId: studio?._id,
      bookingDate,
      startTime,
      studioImgUrl: item?.studioImgUrl,
      hours,
      customerName,
      customerPhone,
      comment
    };
  }, [selectedDate, selectedQuantity, studio, item, customerName, customerPhone, comment, addOnsTotal, t]);

  // Execute the actual booking mutation
  const executeBooking = useCallback(
    (bookingItem: CartItem) => {
      reserveItemTimeSlotMutation.mutate(
        {
          ...bookingItem,
          customerId: user?._id,
          addOnIds: selectedAddOnIds
        },
        {
          onSuccess: (response) => {
            localStorage.setItem(`reservation_${itemId}`, response);
            setCurrentReservationId(response);
            addItemToCartMutation.mutate({ ...bookingItem, reservationId: response });
            setShowPaymentStep(false);
            setPendingBookingItem(null);
            setPaymentError('');
            // Don't clear selections here - preserve them for user convenience
          },
          onError: (error: any) => {
            setPaymentError(error.message || t('toasts.error.bookingFailed', 'Booking failed'));
          }
        }
      );
    },
    [reserveItemTimeSlotMutation, user?._id, selectedAddOnIds, itemId, addItemToCartMutation, t]
  );

  const handleBookNow = useCallback(() => {
    const bookingItem = prepareBookingItem();
    if (!bookingItem) return;

    // Only show payment step if:
    // 1. Item has a price (total > 0)
    // 2. Studio owner has payment integration enabled
    // Otherwise, book directly without payment (old flow)
    const shouldShowPayment = bookingItem.total > 0 && studio?.paymentEnabled === true;

    if (shouldShowPayment) {
      setPendingBookingItem(bookingItem);
      setShowPaymentStep(true);
      setPaymentError('');
    } else {
      // No payment needed - either free or owner hasn't set up payments
      executeBooking(bookingItem);
    }
  }, [prepareBookingItem, executeBooking, studio?.paymentEnabled]);

  // Handle payment submission from OrderSummary
  const handlePaymentSubmit = useCallback(
    async (paymentData: { method: 'saved' | 'new'; cardId?: string; singleUseToken?: string }) => {
      if (!pendingBookingItem) return;

      // Add payment info to booking item
      const bookingItemWithPayment: CartItem = {
        ...pendingBookingItem,
        customerEmail: user?.email,
        // New card: pass the single-use token
        // Saved card: set flag to use customer's saved card
        singleUseToken: paymentData.method === 'new' ? paymentData.singleUseToken : undefined,
        useSavedCard: paymentData.method === 'saved'
      };

      executeBooking(bookingItemWithPayment);
    },
    [pendingBookingItem, user?.email, executeBooking]
  );

  // Handle going back from payment step
  const handleBackFromPayment = useCallback(() => {
    setShowPaymentStep(false);
    setPendingBookingItem(null);
    setPaymentError('');
  }, []);

  const handleGoToEdit = useCallback(
    (itemId: string) => (itemId ? langNavigate(`/item/${itemId}/edit`) : null),
    [langNavigate]
  );
  const handleImageClicked = useCallback(
    () => langNavigate(`/studio/${item?.studioId}`),
    [langNavigate, item?.studioId]
  );

  // Format booking date and time for OrderSummary
  const formattedBookingDate = useMemo(() => {
    if (!pendingBookingItem?.bookingDate) return '';
    return pendingBookingItem.bookingDate;
  }, [pendingBookingItem?.bookingDate]);

  const formattedBookingTime = useMemo(() => {
    if (!pendingBookingItem?.startTime || !pendingBookingItem?.hours) return '';
    const startHour = parseInt(pendingBookingItem.startTime.split(':')[0]);
    const endHour = startHour + pendingBookingItem.hours;
    return `${pendingBookingItem.startTime} - ${String(endHour).padStart(2, '0')}:00`;
  }, [pendingBookingItem?.startTime, pendingBookingItem?.hours]);

  // Build order items for OrderSummary
  const orderItems = useMemo(() => {
    if (!pendingBookingItem || !item) return [];

    const currentLang = i18n.language as 'en' | 'he';
    const itemName = item.name?.[currentLang] || item.name?.en || 'Item';
    const pricePer = item.pricePer || 'hour';
    const unitLabel = t(`quantity_labels.${pricePer}`, { defaultValue: pricePer === 'hour' ? 'hrs' : pricePer });

    const items = [
      {
        id: 'base',
        label: `${itemName} × ${pendingBookingItem.hours} ${unitLabel}`,
        value: (item.price || 0) * (pendingBookingItem.hours || 1),
        isPrice: true
      }
    ];

    // Add selected add-ons
    selectedAddOnIds.forEach((addOnId) => {
      const addOn = addOns.find((a) => a._id === addOnId);
      if (addOn) {
        const addOnName = addOn.name?.[currentLang] || addOn.name?.en || 'Add-on';
        const addOnPrice =
          addOn.pricePer === 'hour' ? (addOn.price || 0) * (pendingBookingItem.hours || 1) : addOn.price || 0;
        items.push({
          id: addOnId,
          label: addOnName,
          value: addOnPrice,
          isPrice: true
        });
      }
    });

    return items;
  }, [pendingBookingItem, item, selectedAddOnIds, addOns, t, i18n.language]);

  // Slide animation variants (same as ItemContent's customer info ↔ reservation transition)
  const isRTL = i18n.language === 'he';
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? '-30%' : '30%') : isRTL ? '30%' : '-30%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? (isRTL ? '30%' : '-30%') : isRTL ? '-30%' : '30%',
      opacity: 0
    })
  };

  const slideTransition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  // Direction: 1 = forward (to payment), -1 = backward (from payment)
  const direction = showPaymentStep ? 1 : -1;

  return (
    <article
      onMouseEnter={prefetchItem}
      className={`details item-details ${showPaymentStep ? 'item-details--payment-active' : ''}`}
    >
      {/* Close button - changes behavior based on step */}
      <button 
        className="close-button" 
        onClick={showPaymentStep ? handleBackFromPayment : closeModal}
      >
        {showPaymentStep ? '←' : '×'}
      </button>

      {/* Header stays visible during payment transition */}
      <ItemHeader
        studio={studio}
        item={item}
        user={user as User}
        onEdit={handleGoToEdit}
        onImageClick={handleImageClicked}
      />
      
      {/* Item card hidden during payment step */}
      {!showPaymentStep && (
        <ItemCard item={item as Item} user={user as User} onEdit={handleGoToEdit} studioActive={studio?.active} />
      )}

      {/* Animated content area - swaps between ItemContent and OrderSummary */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        {showPaymentStep && pendingBookingItem ? (
          <motion.div
            key="payment-content"
            className="item-content-animated"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <OrderSummary
              studioName={item?.studioName?.en || studio?.name?.en || ''}
              studioLocation={studio?.address || ''}
              bookingDate={formattedBookingDate}
              bookingTime={formattedBookingTime}
              items={orderItems}
              totalAmount={pendingBookingItem.total}
              savedCards={savedCards}
              onPaymentSubmit={handlePaymentSubmit}
              onRemoveCard={() => removeSavedCardMutation.mutate()}
              isProcessing={reserveItemTimeSlotMutation.isPending}
              error={paymentError}
              currency="₪"
            />
          </motion.div>
        ) : (
          <motion.div
            key="booking-content"
            className="item-content-animated"
            custom={direction}
            variants={slideVariants}
            initial="center"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
