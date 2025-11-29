import { useUserContext } from '@core/contexts';
import { CartItemPreview } from '@features/entities';
import { useParams } from 'react-router-dom';
import { Cart, Studio } from 'src/types/index';
import { PaymeCheckout } from '@shared/components/checkout';
import { PayMeCartItem } from '@shared/services/payme-service';

interface OrderPageProps {
  studios: Studio[];
  cart?: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart, studios }) => {
  const { studioId } = useParams();
  const { user } = useUserContext();

  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };
  const cartItems = (studioId ? filteredCart.items : cart?.items) || [];

  const vendorId = studios.find((studio) => studio._id === studioId)?.createdBy;

  // Convert cart items to PayMe format
  const paymeCartItems: PayMeCartItem[] = cartItems.map((item) => ({
    name: `${item.name?.en || item.name?.he || 'Item'} at ${item.studioName?.en || item.studioName?.he || 'Studio'}`,
    price: item.price || 0,
    quantity: item.hours || item.quantity || 1,
    itemId: item.itemId,
    studioId: item.studioId
  }));

  return (
    <section className="order-page">
      <div className="cart-content">
        {cartItems.map((item) => (
          <CartItemPreview key={`${item.itemId}-${item.bookingDate}`} item={item} />
        ))}
        <PaymeCheckout
          cartItems={paymeCartItems}
          customer={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone
          }}
          vendorId={vendorId}
        />
      </div>
    </section>
  );
};

export default OrderPage;
