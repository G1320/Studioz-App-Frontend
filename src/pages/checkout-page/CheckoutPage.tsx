import { ShoppingCart, PaypalCheckout } from '@components/index';
import { Cart } from 'src/types/index';
import { Helmet } from 'react-helmet';
// import { Checkout } from '@components/index';

interface CheckoutPageProps {
  cart?: Cart;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart }) => {
  return (
    <section className="checkout-page">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="cart-details">
        <ShoppingCart cart={cart} />
      </section>
      <PaypalCheckout cart={cart} />

      {/* <Checkout /> */}
    </section>
  );
};
export default CheckoutPage;
