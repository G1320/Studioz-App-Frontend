import { useParams, Link } from 'react-router-dom';
import { Cart } from 'src/types/index'; // Assuming you have a Cart type defined
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CheckoutButtonProps {
  cart: Cart;
}

export const ContinueToCheckoutButton: React.FC<CheckoutButtonProps> = ({ cart }) => {
  const { studioId } = useParams();
  const { i18n } = useTranslation();

  // Filter items by studioId from the params
  const studioItems = cart?.items?.filter((item) => item.studioId === studioId);

  // Calculate total item count
  const itemCount = studioItems?.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <div className="checkout-button-container">
      {itemCount > 0 && (
        <Link to={`/${i18n.language}/order/${studioId}`} className="checkout-button">
          {`Continue to Checkout (${itemCount})`}
        </Link>
      )}
    </div>
  );
};
