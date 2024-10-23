import { CartItemsList } from '@/components';
import { Cart } from '@/types/index';
interface CartDetailsPageProps {
  cart?: Cart;
}

export const CartDetailsPage: React.FC<CartDetailsPageProps> = ({ cart }) => {
  return (
    <section className="cart-details-page">
      <CartItemsList cart={cart} />
    </section>
  );
};

export default CartDetailsPage;
