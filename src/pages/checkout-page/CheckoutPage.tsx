import { CartItemsList } from '@components/index';
import { Cart } from 'src/types/index';
import { Helmet } from 'react-helmet';
import Checkout from '../../Checkout';

interface CartDetailsPageProps {
  cart?: Cart;
}

const CartDetailsPage: React.FC<CartDetailsPageProps> = ({ cart }) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Checkout />
      <section className="cart-details-page">
        <CartItemsList cart={cart} />
      </section>
    </>
  );
};
export default CartDetailsPage;
