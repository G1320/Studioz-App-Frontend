import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ReservationDetailsForm, HourSelector, BookingActions } from '@features/entities';
import { MuiDateTimePicker } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { ReservationCard } from '@features/entities/reservations';
import { AddOnsList } from '@features/entities/addOns/components';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { AddOn, Cart, Item, Reservation, Studio } from 'src/types/index';
import { AnimatePresence, motion } from 'framer-motion';
import { getMinimumHours, getMaximumHours, AvailabilityContext } from '@shared/utils/availabilityUtils';

interface ItemContentProps {
  item: Item;
  studio?: Studio;
  cart?: Cart;
  addOns: AddOn[];
  reservation?: Reservation;
  currentReservationId: string | null;
  selectedDate: Date | null;
  selectedQuantity: number;
  customerName: string;
  customerPhone: string;
  comment: string;
  isPhoneVerified: boolean;
  isBooked: boolean;
  isLoading: boolean;
  selectedAddOnIds: string[];
  addOnsTotal: number;
  onDateChange: (date: Date | null) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddOnToggle: (addOn: AddOn) => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onPhoneVerified: () => void;
  onBookNow: () => void;
  onCancelReservation: () => void;
}

// Slide animation variants (same as SteppedForm)
const slideVariants = {
  enter: (isRTL: boolean) => ({
    x: isRTL ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (isRTL: boolean) => ({
    x: isRTL ? '100%' : '-100%',
    opacity: 0
  })
};

const slideTransition = {
  x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
  opacity: { duration: 0.2 }
};

export const ItemContent: React.FC<ItemContentProps> = ({
  item,
  studio,
  cart,
  addOns,
  reservation,
  currentReservationId,
  selectedDate,
  selectedQuantity,
  customerName,
  customerPhone,
  comment,
  isPhoneVerified,
  isBooked,
  isLoading,
  selectedAddOnIds,
  addOnsTotal,
  onDateChange,
  onIncrement,
  onDecrement,
  onAddOnToggle,
  onNameChange,
  onPhoneChange,
  onCommentChange,
  onPhoneVerified,
  onBookNow,
  onCancelReservation
}) => {
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.language === 'he';

  const showReservation = currentReservationId && reservation;

  // Create availability context for calculations
  const availabilityContext = useMemo<AvailabilityContext | null>(() => {
    if (!item) return null;
    return { item, studio };
  }, [item, studio]);

  // Calculate min/max hours based on item constraints and selected date/time
  const minHours = useMemo(() => {
    return item ? getMinimumHours(item) : 1;
  }, [item]);

  const maxHours = useMemo(() => {
    if (!availabilityContext || !selectedDate) return undefined;

    // Get the selected start time from the date
    const selectedDayjs = dayjs(selectedDate);
    const startSlot = selectedDayjs.format('HH:00');

    return getMaximumHours(startSlot, selectedDayjs, availabilityContext);
  }, [availabilityContext, selectedDate]);

  // Get dynamic quantity label based on pricePer, include minimum if > 1
  const quantityLabel = useMemo(() => {
    const pricePer = item?.pricePer || 'hour';
    const baseLabel = t(`quantity_labels.${pricePer}`, t('hours'));
    if (minHours > 1) {
      return `${baseLabel} (${t('min', 'min.')} ${minHours})`;
    }
    return baseLabel;
  }, [item?.pricePer, t, minHours]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false} custom={isRTL}>
        {showReservation ? (
          <motion.div
            key="reservation-card"
            custom={isRTL}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="item-content-animated"
          >
            <ReservationCard reservation={reservation} variant="itemCard" onCancel={onCancelReservation} />
          </motion.div>
        ) : (
          <motion.div
            key="booking-form"
            custom={isRTL}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="item-content-animated"
          >
            {isFeatureEnabled('addOns') && addOns.length > 0 && (
              <section className="item-addons-section">
                <AddOnsList addOns={addOns} showAddButton onAdd={onAddOnToggle} selectedAddOnIds={selectedAddOnIds} />
              </section>
            )}

            <div className="date-picker-row">
              <MuiDateTimePicker
                value={selectedDate}
                onChange={onDateChange}
                itemAvailability={item?.availability || []}
                studioAvailability={studio?.studioAvailability}
                item={item}
                studio={studio}
              />

              <div className="hours-wrapper">
                <label className="hours-label">{quantityLabel}</label>
                <HourSelector
                  value={selectedQuantity}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  min={minHours}
                  max={maxHours}
                />
              </div>
            </div>

            <ReservationDetailsForm
              customerName={customerName}
              customerPhone={customerPhone}
              comment={comment}
              onNameChange={onNameChange}
              onPhoneChange={onPhoneChange}
              onCommentChange={onCommentChange}
              isRTL={isRTL}
              onPhoneVerified={onPhoneVerified}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BookingActions
        price={item?.price || 0}
        quantity={selectedQuantity}
        currentReservationId={currentReservationId}
        isPhoneVerified={isPhoneVerified}
        isBooked={isBooked}
        cart={cart}
        onBookNow={onBookNow}
        addOnsTotal={addOnsTotal}
        isLoading={isLoading}
      />
    </>
  );
};
