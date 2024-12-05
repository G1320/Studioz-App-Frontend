import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartAside } from './CartAside';
import { Cart, CartItem } from 'src/types/index';
import { Button } from '@components/common';

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

// import { GenericList, GenericMuiDropdown } from '@components/common';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { Link } from 'react-router-dom';
// import { CartItemPreview } from './CartItemPreview';
// import CartItem from 'src/types/cartItem';
// import Cart from 'src/types/cart';
// import { useTranslation } from 'react-i18next';

// interface CartItemsListProps {
//   cart?: Cart;
//   isDropdown?: boolean;
//   isMultiSelect?: boolean;
// }

// export const ShoppingCart: React.FC<CartItemsListProps> = ({ cart, isDropdown = false }) => {
//   const { i18n } = useTranslation('header');

//   const totalPrice = cart?.items?.reduce((total: number, item: CartItem) => total + (item.total || 0), 0);
//   const itemCount = cart?.items?.reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0);

//   const renderItem = (item: CartItem) => <CartItemPreview item={item} key={`${item.itemId}-${item.bookingDate}`} />;

//   return (
//     <section className="cart">
//       <Link to={`${i18n.language}/cart`} className="total-price">
//         ₪{totalPrice || '0.00'}
//       </Link>

//       {isDropdown ? (
//         <GenericMuiDropdown
//           data={cart?.items || []}
//           renderItem={renderItem}
//           className="cart-list"
//           icon={<ShoppingCartIcon style={{ color: '#fff', fontSize: '1.6rem' }} />}
//           count={itemCount}
//         />
//       ) : (
//         <GenericList data={cart?.items || []} renderItem={renderItem} className="cart-list" />
//       )}
//     </section>
//   );
// };
