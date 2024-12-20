import { PaypalCheckout, CartItemPreview } from '@components/index';
import { useParams } from 'react-router-dom';
import { Cart, Studio } from 'src/types/index';

interface OrderPageProps {
  studios: Studio[];
  cart: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ studios, cart }) => {
  const { studioId } = useParams();

  const merchantId = studios?.find((studio) => studio._id === studioId)?.paypalMerchantId;

  if (!merchantId) {
    return <p>An issue occurred, please try again later</p>;
  }

  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };

  return (
    <section className="order-page">
      <div className="cart-content">
        {(studioId ? filteredCart.items : cart?.items)?.map((item) => (
          <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />
        ))}
      </div>
      <PaypalCheckout cart={studioId ? filteredCart : cart} merchantId={merchantId} />
    </section>
  );
};

export default OrderPage;
