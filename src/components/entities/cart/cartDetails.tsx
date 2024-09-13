import { CartItemsList } from '@/components';
import { useUserContext } from '@/contexts';
import { useCart } from '@/hooks'
import { Item } from '@/types/index';

interface CartDetailsProps {
  filteredItems?: Item[]; 
}

export const CartDetails: React.FC<CartDetailsProps> = ({ filteredItems = [] }) => { 
  const { user } = useUserContext();
  
  const { data: items } = useCart(user?._id || '');  

  return (
    <section className="cart-details">
      <CartItemsList items={items || filteredItems} />
    </section>
  );
};

export default CartDetails;
