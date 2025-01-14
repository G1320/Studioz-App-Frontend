// components/items/BookingActions.tsx
import React from 'react';
import { Button, ContinueToCheckoutButton } from '@components/index';
import { Cart } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface BookingActionsProps {
  currentReservationId: string | null;
  isPhoneVerified: boolean;
  isBooked: boolean;
  cart?: Cart;
  onBookNow: () => void;
}

export const BookingActions = React.memo(
  ({ currentReservationId, isPhoneVerified, isBooked, cart, onBookNow }: BookingActionsProps) => {
    const { t } = useTranslation('common');

    if (!currentReservationId && isPhoneVerified) {
      return (
        <Button className="add-to-cart-button book-now-button" onClick={onBookNow}>
          {t('buttons.add_to_cart')}
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
