import { CartItemsList } from '@components/index';
import { Cart } from 'src/types/index';
import { Helmet } from 'react-helmet';

interface CartDetailsPageProps {
  cart?: Cart;
}

const CartDetailsPage: React.FC<CartDetailsPageProps> = ({ cart }) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="cart-details-page">
        <CartItemsList cart={cart} />
      </section>
    </>
  );
};
export default CartDetailsPage;
