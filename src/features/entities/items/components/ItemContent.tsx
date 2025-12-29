import React from 'react';
import { ReservationDetailsForm, HourSelector, BookingActions } from '@features/entities';
import { MuiDateTimePicker } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { ReservationCard } from '@features/entities/reservations';
import { AddOnsList } from '@features/entities/addOns/components';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { AddOn, Cart, Item, Reservation, Studio, StudioAvailability } from 'src/types/index';

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

  return (
    <>
      {currentReservationId && reservation && (
        <ReservationCard reservation={reservation} variant="itemCard" onCancel={onCancelReservation} />
      )}

      <div className="date-picker-row">
        {!currentReservationId && (
          <>
            <MuiDateTimePicker
              value={selectedDate}
              onChange={onDateChange}
              itemAvailability={item?.availability || []}
              studioAvailability={studio?.studioAvailability as StudioAvailability}
            />

            <fieldset className="hours-fieldset">
              <legend className="hours-legend">{t('hours', 'Hours')}</legend>
              <HourSelector value={selectedQuantity} onIncrement={onIncrement} onDecrement={onDecrement} />
            </fieldset>
          </>
        )}
      </div>

      {isFeatureEnabled('addOns') && !currentReservationId && addOns.length > 0 && (
        <section className="item-addons-section">
          <AddOnsList addOns={addOns} showAddButton onAdd={onAddOnToggle} selectedAddOnIds={selectedAddOnIds} />
        </section>
      )}

      {!currentReservationId && (
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
      )}

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
