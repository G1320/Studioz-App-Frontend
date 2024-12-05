import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartAside } from './CartAside';
import { Cart, CartItem } from 'src/types/index';

interface CartItemsListProps {
  cart?: Cart;
}

export const ShoppingCart: React.FC<CartItemsListProps> = ({ cart }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const itemCount = cart?.items?.reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0);

  return (
    <div className="cart-wrapper">
      <div role="button" onClick={() => setCartOpen(true)} className="cart-icon">
        <ShoppingCartIcon style={{ fontSize: '1.6rem' }} />
        <div className="icon-wrapper">{itemCount !== undefined && <span className="badge">{itemCount}</span>}</div>
      </div>
      <CartAside cart={cart} isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};
