import React from 'react';
import CartItemsList from './cartItemsList';
import { useUserCart } from '../../../hooks/dataFetching/useUserCart';
import { useUserContext } from '../../../contexts/UserContext';

const CartDetails = ({ filteredItems = null }) => {
  const { user } = useUserContext();
  const { data: cartItems } = useUserCart(user?._id);

  return (
    <section className="cart-details">
      <CartItemsList cartItems={cartItems || filteredItems} />
    </section>
  );
};

export default CartDetails;
