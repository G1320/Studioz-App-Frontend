import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { CartItem } from '@/types/index';
import { formatBookingDate } from '@/utils';
import { useAddItemToCartMutation } from '@/hooks'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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

  const handleIncrementQuantity = (e: React.MouseEvent, item: CartItem ) => {
    e.stopPropagation();
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

  const handleDecrementQuantity = (e: React.MouseEvent, item: CartItem) => {
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
      <div className='cart-item-quantity-container'>
        <Button onClick={(e) => handleDecrementQuantity(e, item)} className="remove-from-cart"><RemoveCircleOutlineIcon  className='icon decrement-quantity-button'/></Button>
        <small className='cart-item-preview-quantity' onClick={handleClick}>Hrs: {item.quantity}</small>
        <Button onClick={(e) => handleIncrementQuantity(e, item)} className="increment-quantity"><AddCircleOutlineIcon className='icon increment-quantity-button'/></Button>
      </div>
    </article>
  );
};

export default CartItemPreview;
