import React from 'react';
import { ContinueToCheckoutButton } from '@features/entities';
import { Button } from '@shared/components';
import { Cart } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface BookingActionsProps {
  price: number;
  quantity: number;
  currentReservationId: string | null;
  isPhoneVerified: boolean;
  isBooked: boolean;
  cart?: Cart;
  onBookNow: () => void;
  addOnsTotal?: number;
}

export const BookingActions = React.memo(
  ({ price, quantity, currentReservationId, isPhoneVerified, isBooked, cart, onBookNow, addOnsTotal = 0 }: BookingActionsProps) => {
    const { t } = useTranslation('common');

    const totalPrice = price * quantity + addOnsTotal;

    if (!currentReservationId && isPhoneVerified) {
      return (
        <Button className="add-to-cart-button book-now-button" onClick={onBookNow}>
          {t('buttons.add_to_cart')}
          <span>({totalPrice}₪)</span>
        </Button>
      );
    }

    if (cart && isPhoneVerified && isBooked) {
      return <ContinueToCheckoutButton cart={cart} />;
    }

    return null;
  }
);

BookingActions.displayName = 'BookingActions';
