import { PaypalCheckout, CartItemPreview } from '@components/index';
import { useParams } from 'react-router-dom';
import { Cart } from 'src/types/index';

interface OrderPageProps {
  cart: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart }) => {
  const { studioId } = useParams();

  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };

  return (
    <section className="order-page">
      <div className="cart-content">
        {(studioId ? filteredCart.items : cart?.items)?.map((item) => (
          <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />
        ))}
      </div>
      <PaypalCheckout cart={studioId ? filteredCart : cart} />
    </section>
  );
};

export default OrderPage;
