import { useNavigate } from 'react-router-dom';
import { Button } from '@components/index';
import { CartItem } from '@models/index';
import { useAddItemToCartMutation, useRemoveItemFromCartMutation } from '@hooks/index';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  useReserveStudioItemTimeSlotMutation,
  useReleaseStudioItemTimeSlotMutation
} from '@hooks/mutations/bookings/bookingMutations';

interface CartItemPreviewProps {
  item: CartItem;
}

export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item }) => {
  const navigate = useNavigate();
  const addItemToCartMutation = useAddItemToCartMutation();
  const removeItemFromCartMutation = useRemoveItemFromCartMutation();

  const reserveItemTimeSlotMutation = useReserveStudioItemTimeSlotMutation(item.itemId);
  const releaseItemTimeSlotMutation = useReleaseStudioItemTimeSlotMutation(item.itemId);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON' && target.nodeName !== 'svg') {
      navigate(`/item/${item?.itemId}`);
    }
  };
  const handleQuantityChange = (e: React.MouseEvent, item: CartItem, isIncrement: boolean = true) => {
    e.stopPropagation();

    const quantity = isIncrement ? (item.quantity || 0) + 1 : Math.max((item.quantity || 1) - 1, 1);

    const newItem = {
      ...item,
      quantity,
      total: item.price * quantity
    };

    if (isIncrement) {
      reserveItemTimeSlotMutation.mutate(newItem, {
        onSuccess: () => {
          addItemToCartMutation.mutate(newItem);
        },
        onError: (error) => {
          console.error('Booking failed:', error);
        }
      });
    } else {
      releaseItemTimeSlotMutation.mutate(newItem, {
        onSuccess: () => {
          removeItemFromCartMutation.mutate(item);
        },
        onError: (error) => {
          console.error('Booking error, unable to release time slot:', error);
        }
      });
    }
  };

  return (
    <article onClick={handleClick} className="preview cart-item-preview">
      <div>
        <h3 onClick={handleClick}>{item?.name}</h3>
        <p>{item?.studioName}</p>
      </div>
      <div>
        <div className="cart-item-booking-date-time-container">
          <small>{item?.bookingDate}</small>
          <small>{item?.startTime}</small>
        </div>
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
        <Button onClick={(e) => handleQuantityChange(e, item)} className="increment-quantity">
          <AddCircleOutlineIcon className="icon increment-quantity-button" />
        </Button>
      </div>
    </article>
  );
};
