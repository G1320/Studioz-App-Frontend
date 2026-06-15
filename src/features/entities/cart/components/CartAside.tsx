import React, { useEffect, useRef } from 'react';
import { CartItemCard } from './CartItemCard';
import Cart from 'src/types/cart';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { featureFlags } from '@core/config/featureFlags';

interface CartAsideProps {
  cart?: Cart;
  isOpen: boolean;
  onClose: () => void;
}

export const CartAside: React.FC<CartAsideProps> = ({ cart, isOpen, onClose }) => {
  const totalPrice = cart?.items?.reduce((total, item) => total + (item.price * (item.quantity || 0) || 0), 0);
  const { t, i18n } = useTranslation('common');
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <aside
      ref={asideRef}
      className={`cart-aside ${isOpen ? 'open' : ''}`}
      data-direction={i18n.dir()}
      aria-label={t('navigation.cart', 'Your cart')}
      aria-hidden={!isOpen}
    >
      <div className="cart-aside-header">
        <h2>{t('navigation.cart', 'Your Cart')}</h2>
        <button type="button" onClick={onClose} className="close-btn" aria-label="Close cart">
          ×
        </button>
      </div>
      <div className="cart-aside-content">
        {cart?.items?.map((item) => <CartItemCard key={`${item.itemId}-${item.bookingDate}`} item={item} />)}
      </div>
      <div className="cart-aside-footer">
        <div className="total">
          <span>Total:</span>
          <span>₪{totalPrice?.toFixed(2)}</span>
        </div>
        {featureFlags.checkout && (
          <Link to={`${i18n.language}/order`} onClick={onClose} className="checkout-button">
            Checkout
          </Link>
        )}
      </div>
    </aside>
  );
};
