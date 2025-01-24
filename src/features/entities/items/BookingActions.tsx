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
}

export const BookingActions = React.memo(
  ({ price, quantity, currentReservationId, isPhoneVerified, isBooked, cart, onBookNow }: BookingActionsProps) => {
    const { t } = useTranslation('common');

    if (!currentReservationId && isPhoneVerified) {
      return (
        <Button className="add-to-cart-button book-now-button" onClick={onBookNow}>
          {t('buttons.add_to_cart')}
          <span>({price * quantity}₪)</span>
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
