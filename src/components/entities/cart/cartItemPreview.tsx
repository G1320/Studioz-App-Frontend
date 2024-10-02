import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { CartItem } from '@/types/index';
import { formatBookingDate } from '@/utils';

interface CartItemPreviewProps {
  item: CartItem;
  onRemoveFromCart: (item: CartItem) => void;
}

export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item, onRemoveFromCart }) => {
  
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON') {
      navigate(`/item/${item?.itemId}`);
    }
  };

  return (
    <article onClick={handleClick} className="preview cart-item-preview">
      <h3 onClick={handleClick}>{item?.name}</h3>
      <p>{item?.studioName}</p>
      <small>{formatBookingDate(item?.bookingDate)}</small>
      <div>
        <small className='cart-item-preview-price' onClick={handleClick}>${item?.price?.toFixed(2)}</small>
        <small className='cart-item-preview-quantity' onClick={handleClick}>Hrs: {item.quantity}</small>
      </div>
      <Button onClick={() => onRemoveFromCart(item)} className="remove-from-cart">
        Remove
      </Button>
    </article>
  );
};

export default CartItemPreview;
