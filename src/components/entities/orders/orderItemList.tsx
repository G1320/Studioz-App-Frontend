// OrderItemsList.tsx
import { GenericList } from '@components/common';
import OrderItemPreview from './orderItemPreview';
import { CartItem, Cart } from 'src/types/index';

interface OrderItemsListProps {
  cart: Cart;
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ cart }) => {
  const totalPrice = cart.items.reduce((total, item) => total + (item.total || 0), 0);
  const itemCount = cart.items.reduce((total, item) => total + (item.quantity || 0), 0);

  const renderItem = (item: CartItem) => (
    <OrderItemPreview orderItem={item} key={`${item.itemId}-${item.bookingDate}`} />
  );

  return (
    <section className="cart">
      <p className="total-price">₪{totalPrice.toFixed(2)}</p>
      <p className="total-quantity">{itemCount} Items in order</p>

      <GenericList data={cart.items} renderItem={renderItem} className="cart-list" />
    </section>
  );
};
