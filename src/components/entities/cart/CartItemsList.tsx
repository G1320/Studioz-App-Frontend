import { Link } from 'react-router-dom';
import { CartItemPreview, GenericList, GenericMuiDropdown, GenericMultiDropdownEntryPreview } from '@components/index';
import { Cart, CartItem } from '@models/index';

interface CartItemsListProps {
  cart?: Cart;
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({ cart, isDropdown = false, isMultiSelect = false }) => {
  const totalPrice = cart?.items?.reduce((total, item) => total + (item.total || 0), 0);

  const renderItem = (item: CartItem) =>
    isMultiSelect ? (
      <GenericMultiDropdownEntryPreview entry={{ name: item.name || '', _id: item.itemId }} key={item?.itemId} />
    ) : (
      <CartItemPreview item={item} key={`${item.itemId}-${item.bookingDate}`} />
    );

  return (
    <section className="cart">
      <Link to={'/cart'} className="total-price">
        ${totalPrice || '0.00'}
      </Link>

      {isDropdown ? (
        <GenericMuiDropdown
          data={cart?.items || []}
          renderItem={renderItem}
          className="cart-list"
          title={`Cart (${cart?.items?.reduce((total, item) => total + item.quantity!, 0) || 0})`}
        />
      ) : (
        <>
          <GenericList data={cart?.items || []} renderItem={renderItem} className="cart-list" />
        </>
      )}
    </section>
  );
};
