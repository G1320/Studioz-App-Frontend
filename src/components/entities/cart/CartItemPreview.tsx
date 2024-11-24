import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/index';
import { CartItem } from '@models/index';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CloseOutlined } from '@mui/icons-material';
import { useCartItemQuantityHandler } from '@hooks/utils/useCartItemQuantityHandler';

interface CartItemPreviewProps {
  item: CartItem;
}

export const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item }) => {
  const navigate = useNavigate();
  const { handleQuantityChange } = useCartItemQuantityHandler(item);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON' && target.nodeName !== 'svg') {
      navigate(`/item/${item?.itemId}`);
    }
  };

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
          onClick={(e) => handleQuantityChange(e, false)}
          className="decrement-quantity"
          aria-label="Decrease quantity"
        >
          {item.quantity && item.quantity <= 1 ? (
            <CloseOutlined className="icon remove-item-button" />
          ) : (
            <RemoveCircleOutlineIcon className="icon decrement-quantity-button" />
          )}
        </Button>
        <small className="cart-item-preview-quantity" onClick={handleClick}>
          hours: {item.quantity}
        </small>
        <Button onClick={(e) => handleQuantityChange(e, true)} className="increment-quantity">
          <AddCircleOutlineIcon className="icon increment-quantity-button" />
        </Button>
      </div>
    </article>
  );
};
