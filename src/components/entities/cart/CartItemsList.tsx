import { GenericList, GenericMuiDropdown } from '@components/common';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { CartItemPreview } from './CartItemPreview';
import CartItem from '@models/cartItem';
import Cart from '@models/cart';

interface CartItemsListProps {
  cart?: Cart;
  isDropdown?: boolean;
  isMultiSelect?: boolean;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({ cart, isDropdown = false }) => {
  const totalPrice = cart?.items?.reduce((total: number, item: CartItem) => total + (item.total || 0), 0);
  const itemCount = cart?.items?.reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0);

  const renderItem = (item: CartItem) => <CartItemPreview item={item} key={`${item.itemId}-${item.bookingDate}`} />;

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
          icon={<ShoppingCartIcon style={{ color: '#fff', fontSize: '1.6rem' }} />}
          count={itemCount}
        />
      ) : (
        <GenericList data={cart?.items || []} renderItem={renderItem} className="cart-list" />
      )}
    </section>
  );
};

// import { Link } from 'react-router-dom';
// import { CartItemPreview, GenericList, GenericMuiDropdown, GenericMultiDropdownEntryPreview } from '@components/index';
// import { Cart, CartItem } from '@models/index';
// import { useTranslation } from 'react-i18next';

// interface CartItemsListProps {
//   cart?: Cart;
//   isDropdown?: boolean;
//   isMultiSelect?: boolean;
// }

// export const CartItemsList: React.FC<CartItemsListProps> = ({ cart, isDropdown = false, isMultiSelect = false }) => {
//   const { t } = useTranslation('common');
//   const totalPrice = cart?.items?.reduce((total, item) => total + (item.total || 0), 0);

//   const renderItem = (item: CartItem) =>
//     isMultiSelect ? (
//       <GenericMultiDropdownEntryPreview entry={{ name: item.name || '', _id: item.itemId }} key={item?.itemId} />
//     ) : (
//       <CartItemPreview item={item} key={`${item.itemId}-${item.bookingDate}`} />
//     );

//   return (
//     <section className="cart">
//       <Link to={'/cart'} className="total-price">
//         ${totalPrice || '0.00'}
//       </Link>

//       {isDropdown ? (
//         <GenericMuiDropdown
//           data={cart?.items || []}
//           renderItem={renderItem}
//           className="cart-list"
//           title={`${t('buttons.cart')} (${cart?.items?.reduce((total, item) => total + item.quantity!, 0) || 0})`}
//         />
//       ) : (
//         <>
//           <GenericList data={cart?.items || []} renderItem={renderItem} className="cart-list" />
//         </>
//       )}
//     </section>
//   );
// };
