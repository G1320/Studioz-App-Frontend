import { useUserContext } from '@core/contexts';
import { CartItemPreview } from '@features/entities';
import { useParams } from 'react-router-dom';
import { Cart, Studio } from 'src/types/index';
import { SumitMultiVendorPaymentForm } from '@features/entities';

interface OrderPageProps {
  studios: Studio[];
  cart?: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart, studios }) => {
  const { studioId } = useParams();
  const { user } = useUserContext();

  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };

  const vendorId = studios.find((studio) => studio._id === studioId)?.createdBy;

  return (
    <section className="order-page">
      <div className="cart-content">
        {(studioId ? filteredCart.items : cart?.items)?.map((item) => (
          <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />
        ))}
        <SumitMultiVendorPaymentForm
          cartItems={studioId ? filteredCart : cart?.items || []}
          customer={user}
          vendorId={vendorId}
        />
      </div>
    </section>
  );
};

export default OrderPage;
