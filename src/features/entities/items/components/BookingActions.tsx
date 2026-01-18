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
  isLoading?: boolean;
  paymentEnabled?: boolean;
}

export const BookingActions = React.memo(
  ({
    price,
    quantity,
    currentReservationId,
    isPhoneVerified,
    isBooked,
    cart,
    onBookNow,
    addOnsTotal = 0,
    isLoading = false,
    paymentEnabled = false
  }: BookingActionsProps) => {
    const { t } = useTranslation('common');

    const totalPrice = price * quantity + addOnsTotal;
    const buttonText = paymentEnabled 
      ? t('buttons.continue_to_payment', 'Continue to Payment')
      : t('buttons.add_to_cart');

    if (!currentReservationId && isPhoneVerified) {
      return (
        <Button
          className="add-to-cart-button book-now-button"
          onClick={onBookNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="button-loading-spinner" />
          ) : (
            <>
          {buttonText}
          <span>({totalPrice}₪)</span>
            </>
          )}
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
