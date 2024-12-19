import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartAside } from './CartAside';
import { Cart } from 'src/types/index';

interface CartItemsListProps {
  cart?: Cart;
}

export const ShoppingCart: React.FC<CartItemsListProps> = ({ cart }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const itemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0);

  const handleCartToggle = () => setCartOpen((prev) => !prev);

  return (
    <div className="cart-wrapper">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCartToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleCartToggle()}
        className="cart-icon"
      >
        <ShoppingCartIcon style={{ fontSize: '1.6rem' }} />
        <div className="icon-wrapper">{itemCount && <small className="badge">{itemCount}</small>}</div>
      </div>
      <CartAside cart={cart} isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};
