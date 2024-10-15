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
    if (target.nodeName !== 'BUTTON' && target.nodeName !== 'svg') {
      navigate(`/item/${item?.itemId}`);
    }
  };

  const handleQuantityChange = (e: React.MouseEvent, item: CartItem, isIncrement: boolean = true) => {
    e.stopPropagation();
    if (isIncrement) {
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
          studioImgUrl: item.studioImgUrl
        });
      }
    } else {
      onDecrementQuantity(item);
    }
  };

  return (
    <article onClick={handleClick} className="preview cart-item-preview">
      <div>
        <h3 onClick={handleClick}>{item?.name}</h3>
        <p>{item?.studioName}</p>
      </div>
      <div>
        <small>{formatBookingDate(item?.bookingDate)}</small>
        <div>
          <small className="cart-item-preview-price" onClick={handleClick}>
            Price: ${item?.price?.toFixed(2)}
          </small>
        </div>
      </div>
      <div className="cart-item-quantity-container">
        <Button onClick={(e) => handleQuantityChange(e, item, false)} className="remove-from-cart">
          <RemoveCircleOutlineIcon className="icon decrement-quantity-button" />
        </Button>
        <small className="cart-item-preview-quantity" onClick={handleClick}>
          hours: {item.quantity}
        </small>
        <Button onClick={(e) => handleQuantityChange(e, item, true)} className="increment-quantity">
          <AddCircleOutlineIcon className="icon increment-quantity-button" />
        </Button>
      </div>
    </article>
  );
};

export default CartItemPreview;
