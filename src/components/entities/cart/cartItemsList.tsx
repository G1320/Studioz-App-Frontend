import React from 'react';
import GenericList from '../../common/lists/genericList';
import GenericMuiDropdown from '../../common/lists/genericMuiDropdown';
import GenericMultiDropdownEntryPreview from '../../common/lists/genericMultiDropdownEntryPreview';
import CartItemPreview from './cartItemPreview';
import {
  useRemoveItemFromCartMutation,
} from '../../../hooks/mutations/cart/cartMutations';
import { calculateTotalPrice, getItemQuantityMap, getUniqueItems } from '../../../utils/cartUtils';
import { Link } from 'react-router-dom';

import { Item } from '../../../../../shared/types';

interface CartItemsListProps {
  items: Item[];
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items, isDropdown = false, isMultiSelect = false }) => {
  const removeItemFromCartMutation = useRemoveItemFromCartMutation();
  // const deleteUserCartMutation = useDeleteUserCartMutation();

  const totalPrice = calculateTotalPrice(items);
  const itemQuantityMap = getItemQuantityMap(items);
  const uniqueItems = getUniqueItems(items, itemQuantityMap);

  const handleRemoveFromCart = (item:Item) =>  removeItemFromCartMutation.mutate(item?._id);
  ;

  // const handleClearCart = () => {
  //   if (items.length === 0) return toast.error('Cart is empty');
  //   deleteUserCartMutation.mutate();
  // };

  const renderItem = isMultiSelect
    ? (item:Item) => <GenericMultiDropdownEntryPreview entry={item} key={item?._id} />
    : (item:Item) => (
        <CartItemPreview
          item={item}
          quantity={itemQuantityMap?.get(item?._id) || 0}
          onRemoveFromCart={handleRemoveFromCart}
          key={item?._id}
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
            data={uniqueItems}
            renderItem={renderItem}
            className="cart-list"
            title={`Cart (${items?.length || 0})`}
          />
        </>
      ) : (
        <>
          {/* <button className="clear-cart" onClick={handleClearCart}>
            Clear
          </button> */}
          <GenericList data={uniqueItems} renderItem={renderItem} className="cart-list" />
        </>
      )}
    </section>
  );
};

export default CartItemsList;
