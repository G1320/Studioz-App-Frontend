import { ShoppingCart, OrderItemsList, PaypalCheckout } from '@components/index';
// import { useParams } from 'react-router-dom';
import { Cart } from 'src/types/index';

interface OrderPageProps {
  cart: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart }) => {
  // const { studioId } = useParams();

  // const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };
  return (
    <section className="order-page">
      <ShoppingCart cart={cart} />
      <OrderItemsList cart={cart} />
      <PaypalCheckout cart={cart} />
    </section>
  );
};

export default OrderPage;
