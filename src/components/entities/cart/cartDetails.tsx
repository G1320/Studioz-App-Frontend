import React from 'react';
import CartItemsList from './cartItemsList';
import { useCart } from '../../../hooks/dataFetching/useCart';
import { useUserContext } from '../../../contexts/UserContext';
import { Item } from '../../../../../shared/types';

interface CartDetailsProps {
  filteredItems?: Item[]; 
}

const CartDetails: React.FC<CartDetailsProps> = ({ filteredItems = [] }) => { 
  const { user } = useUserContext();
  
  const { data: items } = useCart(user?._id ?? '');  

  return (
    <section className="cart-details">
      <CartItemsList items={items || filteredItems} />
    </section>
  );
};

export default CartDetails;
