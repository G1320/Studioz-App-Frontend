import React from 'react';
import GenericList from '../../common/lists/genericList';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import GenericMultiDropdownEntryPreview from '../../common/lists/genericMultiDropdownEntryPreview';
import CartItemPreview from './cartItemPreview';
import {
  useDeleteUserCartMutation,
  useRemoveItemFromCartMutation,
} from '../../../hooks/mutations/cart/cartMutations';
import { calculateTotalPrice, getItemQuantityMap, getUniqueItems } from '../../../utils/cartUtils';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useOfflineCartContext } from '../../../contexts/OfflineCartContext';
import { useUserContext } from '../../../contexts/UserContext';

const CartItemsList = ({ cartItems, isDropdown = false, isMultiSelect = false }) => {
  const removeItemFromCartMutation = useRemoveItemFromCartMutation();
  const deleteUserCartMutation = useDeleteUserCartMutation();
  const { user } = useUserContext();
  const { offlineCart, setOfflineCart } = useOfflineCartContext();

  const totalPrice = calculateTotalPrice(cartItems);
  const itemQuantityMap = getItemQuantityMap(cartItems);
  const uniqueCartItems = getUniqueItems(cartItems, itemQuantityMap);

  const handleRemoveFromCart = (item) => {
    if (user) {
      setOfflineCart(offlineCart.filter((cartItem) => cartItem !== item._id));
    }
    removeItemFromCartMutation.mutate(item._id);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return toast.error('Cart is already empty');
    deleteUserCartMutation.mutate();
  };

  const renderItem = isMultiSelect
    ? (item) => <GenericMultiDropdownEntryPreview entry={item} key={item._id} />
    : (item) => (
        <CartItemPreview
          item={item}
          quantity={itemQuantityMap?.get(item._id)}
          onRemoveFromCart={handleRemoveFromCart}
          key={item._id}
        />
      );

  return (
    <section className="cart">
      <Link to={'/cart'} className="total-price">
        ${totalPrice || '0.00'}
      </Link>

      {isDropdown ? (
        <>
          <GenericMuiDropdown
            data={uniqueCartItems}
            renderItem={renderItem}
            className="cart-list"
            title={`Cart (${cartItems?.length || 0})`}
          />
        </>
      ) : (
        <>
          <button className="clear-cart" onClick={handleClearCart}>
            Clear
          </button>
          <GenericList data={uniqueCartItems} renderItem={renderItem} className="cart-list" />
        </>
      )}
    </section>
  );
};

export default CartItemsList;
