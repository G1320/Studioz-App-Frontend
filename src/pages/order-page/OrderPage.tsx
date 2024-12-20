import { PaypalCheckout, CartItemPreview } from '@components/index';
import { useStudio } from '@hooks/dataFetching';
import { useParams } from 'react-router-dom';
import { Cart } from 'src/types/index';

interface OrderPageProps {
  cart: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart }) => {
  const { studioId } = useParams();
  const { data: studioObj } = useStudio(studioId || '');

  const studio = studioObj?.currStudio;
  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };

  return (
    <section className="order-page">
      <div className="cart-content">
        {(studioId ? filteredCart.items : cart?.items)?.map((item) => (
          <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />
        ))}
      </div>
      <PaypalCheckout cart={studioId ? filteredCart : cart} studioSellerId={studio?.createdBy} />
    </section>
  );
};

export default OrderPage;
