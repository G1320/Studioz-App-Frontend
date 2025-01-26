import { CartItemPreview } from '@features/entities';
import { useParams } from 'react-router-dom';
import { Cart, Studio } from 'src/types/index';

interface OrderPageProps {
  studios: Studio[];
  cart?: Cart;
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
    </section>
  );
};

export default OrderPage;
