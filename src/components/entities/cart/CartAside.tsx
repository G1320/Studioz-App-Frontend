import React, { useEffect, useRef } from 'react';
import { CartItemPreview } from '@components/index';
import Cart from 'src/types/cart';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CartAsideProps {
  cart?: Cart;
  isOpen: boolean;
  onClose: () => void;
}

export const CartAside: React.FC<CartAsideProps> = ({ cart, isOpen, onClose }) => {
  const totalPrice = cart?.items.reduce((total, item) => total + (item.price * (item.quantity || 0) || 0), 0);
  const { i18n } = useTranslation();
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
    <aside ref={asideRef} className={`cart-aside ${isOpen ? 'open' : ''}`} data-direction={i18n.dir()}>
      <div className="cart-aside-header">
        <h2>Your Cart</h2>
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      </div>
      <div className="cart-aside-content">
        {cart?.items?.map((item) => <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />)}
      </div>
      <div className="cart-aside-footer">
        <div className="total">
          <span>Total:</span>
          <span>₪{totalPrice?.toFixed(2)}</span>
        </div>
        <Link to={`${i18n.language}/order`} onClick={onClose} className="checkout-btn">
          Checkout
        </Link>
      </div>
    </aside>
  );
};
