import React from 'react';
import { Button, CartItemPreview } from '@components/index';
import Cart from 'src/types/cart';
import CartItem from 'src/types/cartItem';

interface CartAsideProps {
  cart?: Cart;
  isOpen: boolean;
  onClose: () => void;
}

export const CartAside: React.FC<CartAsideProps> = ({ cart, isOpen, onClose }) => {
  const totalPrice = cart?.items?.reduce((total: number, item: CartItem) => total + (item.total || 0), 0);

  return (
    <aside className={`cart-aside ${isOpen ? 'open' : ''}`}>
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
        <button className="checkout-btn" onClick={() => console.log('Checkout!')}>
          Checkout
        </button>
      </div>
    </aside>
  );
};
