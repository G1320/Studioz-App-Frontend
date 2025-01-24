import { useParams, Link } from 'react-router-dom';
import { Cart } from 'src/types/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '@core/contexts';

interface CheckoutButtonProps {
  cart?: Cart;
}

export const ContinueToCheckoutButton: React.FC<CheckoutButtonProps> = ({ cart }) => {
  const { studioId } = useParams();
  const { i18n } = useTranslation();

  const onClose = useModal().closeModal;

  // Filter items by studioId from the params
  const studioItems = cart?.items?.filter((item) => item.studioId === studioId);

  // Calculate total item count
  const itemCount = studioItems?.reduce((acc, item) => acc + (item.quantity || 0), 0);

  if (!itemCount) return null;

  return (
    <div className="checkout-button-container">
      <Link to={`/${i18n.language}/order/${studioId}`} onClick={onClose} className="checkout-button">
        {`Continue to Checkout (${itemCount})`}
      </Link>
    </div>
  );
};
