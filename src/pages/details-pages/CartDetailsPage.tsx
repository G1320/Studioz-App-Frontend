import { CartItemsList } from '@components/index';
import { Cart } from '@models/index';
interface CartDetailsPageProps {
  cart?: Cart;
}

const CartDetailsPage: React.FC<CartDetailsPageProps> = ({ cart }) => {
  return (
    <section className="cart-details-page">
      <CartItemsList cart={cart} />
    </section>
  );
};
export default CartDetailsPage;
