import { useNavigate } from 'react-router-dom';
import { Button } from '@components/index';
import { CartItem } from '@models/index';
import { useAddItemToCartMutation, useRemoveItemFromCartMutation } from '@hooks/index';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  useReserveNextStudioItemTimeSlotMutation,
  useReleaseLastStudioItemTimeSlotMutation
} from '@hooks/mutations/bookings/bookingMutations';

interface CartItemPreviewProps {
  item: CartItem;
}

export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item }) => {
  const navigate = useNavigate();
  const addItemToCartMutation = useAddItemToCartMutation();
  const removeItemFromCartMutation = useRemoveItemFromCartMutation();

  const reserveItemTimeSlotMutation = useReserveNextStudioItemTimeSlotMutation(item.itemId);
  const releaseItemTimeSlotMutation = useReleaseLastStudioItemTimeSlotMutation(item.itemId);

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
      total: item.price * quantity,
      hours: quantity
    };

    if (isIncrement) {
      reserveItemTimeSlotMutation.mutate(
        { ...newItem, hours: quantity },
        {
          onSuccess: () => {
            addItemToCartMutation.mutate({ ...newItem, hours: 1 });
          },
          onError: (error) => {
            console.error('Booking failed:', error);
          }
        }
      );
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

  // Calculate end time for display
  const getTimeRange = () => {
    if (!item.startTime || !item.quantity) return item.startTime;
    const startHour = parseInt(item.startTime);
    const endHour = startHour + item.quantity;
    return `${item.startTime} - ${String(endHour).padStart(2, '0')}:00`;
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
          <small>{getTimeRange()}</small>
        </div>
        <div>
          <small className="cart-item-preview-price" onClick={handleClick}>
            Price: ${item?.price}/hr
          </small>
        </div>
      </div>
      <div className="cart-item-quantity-container">
        <Button
          onClick={(e) => handleQuantityChange(e, item, false)}
          className="remove-from-cart"
          disabled={!item.quantity || item.quantity <= 1}
        >
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
