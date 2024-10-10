// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components';
// import { CartItem } from '@/types/index';
// import { formatBookingDate } from '@/utils';

// interface CartItemPreviewProps {
//   item: CartItem;
//   onRemoveFromCart: (item: CartItem) => void;
// }

// export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item, onRemoveFromCart }) => {
  
//   const navigate = useNavigate();

//   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
//     const target = e.target as HTMLElement;
//     if (target.nodeName !== 'BUTTON') {
//       navigate(`/item/${item?.itemId}`);
//     }
//   };

//   return (
//     <article onClick={handleClick} className="preview cart-item-preview">
//       <h3 onClick={handleClick}>{item?.name}</h3>
//       <p>{item?.studioName}</p>
//       <small>{formatBookingDate(item?.bookingDate)}</small>
//       <div>
//         <small className='cart-item-preview-price' onClick={handleClick}>${item?.price?.toFixed(2)}</small>
//         <small className='cart-item-preview-quantity' onClick={handleClick}>Hours: {item.quantity}</small>
//       </div>
//       <Button onClick={() => onRemoveFromCart(item)} className="remove-from-cart">
//         Remove
//       </Button>
//     </article>
//   );
// };

// export default CartItemPreview;


import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { CartItem } from '@/types/index';
import { formatBookingDate } from '@/utils';
import { useAddItemToCartMutation } from '@/hooks'; 

interface CartItemPreviewProps {
  item: CartItem;
  onDecrementQuantity: (item: CartItem) => void;
}

export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item, onDecrementQuantity }) => {
  const navigate = useNavigate();
  const addItemToCartMutation = useAddItemToCartMutation();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON') {
      navigate(`/item/${item?.itemId}`);
    }
  };

  const handleIncrementQuantity = () => {
    if (item && item.bookingDate) {
      const newBookingDate = new Date(item.bookingDate);
      newBookingDate.setHours(newBookingDate.getHours() + 1);
      
      addItemToCartMutation.mutate({
        name: item.name,
        itemId: item.itemId,
        bookingDate: newBookingDate,
        quantity: item.quantity ? item.quantity + 1 : 1,
        price: item.price,
        total: item.price * (item.quantity ? item.quantity + 1 : 1),
        studioName: item.studioName,
      });
    }
  };

  const handleRemoveFromCart = (e: React.MouseEvent, item: CartItem) => {
    e.stopPropagation();
    onDecrementQuantity(item);
  };

  return (
    <article onClick={handleClick} className="preview cart-item-preview">
      <h3 onClick={handleClick}>{item?.name}</h3>
      <p>{item?.studioName}</p>
      <small>{formatBookingDate(item?.bookingDate)}</small>
      <div>
        <small className='cart-item-preview-price' onClick={handleClick}>Price: ${item?.price?.toFixed(2)}</small>
      </div>
      <div>
        <Button onClick={(e) => handleRemoveFromCart(e, item)} className="remove-from-cart"> - </Button>
        <small className='cart-item-preview-quantity' onClick={handleClick}>Hrs: {item.quantity}</small>
        <Button onClick={handleIncrementQuantity} className="increment-quantity">+</Button>
      </div>
    </article>
  );
};

export default CartItemPreview;
