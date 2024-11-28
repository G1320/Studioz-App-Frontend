import { CartItemsList, PaypalCheckout } from '@components/index';
import { Cart } from 'src/types/index';
import { Helmet } from 'react-helmet';
// import { Checkout } from '@components/index';

interface CheckoutPageProps {
  cart?: Cart;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart }) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="cart-details-page">
        <CartItemsList cart={cart} />
      </section>
      <PaypalCheckout cart={cart} />

      {/* <Checkout /> */}
    </>
  );
};
export default CheckoutPage;
