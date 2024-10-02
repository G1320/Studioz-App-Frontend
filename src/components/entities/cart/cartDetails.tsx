import { CartItemsList } from '@/components';
import { Cart } from '@/types/index';
interface CartDetailsProps {
  cart?: Cart; 
}

export const CartDetails: React.FC<CartDetailsProps> = ({ cart }) => {   

  return (
    <section className="cart-details">
      <CartItemsList cart={ cart} />
    </section>
  );
};

export default CartDetails;
