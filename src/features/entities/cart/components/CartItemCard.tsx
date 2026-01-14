import React from 'react';
import { CartItem } from 'src/types/index';
import { AddCircleIcon, RemoveCircleIcon, CloseOutlinedIcon } from '@shared/components/icons';
import { useCartItemQuantityHandler, useLanguageNavigate } from '@shared/hooks';
import '../styles/_cart-item-card.scss';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const langNavigate = useLanguageNavigate();

  const { handleQuantityChange } = useCartItemQuantityHandler(item);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON' && target.nodeName !== 'svg') {
      langNavigate(`/item/${item?.itemId}`);
    }
  };

  const getTimeRange = () => {
    if (!item.startTime || !item.quantity) return item.startTime;
    const startHour = parseInt(item.startTime);
    const endHour = startHour + item.quantity;
    return `${item.startTime} - ${String(endHour).padStart(2, '0')}:00`;
  };

  return (
    <article
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      className="card cart-item-card"
      role="button"
      tabIndex={0}
      aria-label={`Cart item: ${item?.name?.en}`}
    >
      <section>
        {item.studioImgUrl && (
          <img
            src={item.studioImgUrl}
            alt={`${item.studioName.en} ${item?.name?.en} service image`}
            className="cart-item-image"
          />
        )}
        <div>
          <h3 tabIndex={0} onClick={handleClick}>
            {item?.name?.en}
          </h3>
          <p>{item?.studioName?.en}</p>
        </div>
      </section>
      <section>
        <div className="cart-item-booking-date-time-container">
          <small>{item?.bookingDate}</small>
          <small>{getTimeRange()}</small>
        </div>
        <div>
          <small
            className="cart-item-card-price"
            tabIndex={0}
            onClick={handleClick}
            aria-label={`Price per hour: ₪${item?.price}`}
          >
            Price: ₪{item?.price}/hr
          </small>
        </div>
      </section>
      <section className="cart-item-quantity-container">
        <button
          onClick={(e) => handleQuantityChange(e, false)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuantityChange(e, false)}
          className="decrement-quantity"
          aria-label={
            item.quantity && item.quantity <= 1
              ? `Remove ${item?.name?.en} from cart`
              : `Decrease quantity of ${item?.name?.en}`
          }
        >
          {item.quantity && item.quantity <= 1 ? (
            <CloseOutlinedIcon className="icon remove-item-button" />
          ) : (
            <RemoveCircleIcon className="icon decrement-quantity-button" />
          )}
        </button>
        <small
          className="cart-item-card-quantity"
          tabIndex={0}
          aria-live="polite"
          aria-label={`Quantity of ${item?.name.en}: ${item?.quantity} hours`}
        >
          Hours: {item.quantity}
        </small>
        <button
          onClick={(e) => handleQuantityChange(e, true)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuantityChange(e, true)}
          className="increment-quantity"
          aria-label={`Increase quantity of ${item?.name.en}`}
        >
          <AddCircleIcon className="icon increment-quantity-button" />
        </button>
      </section>
    </article>
  );
};

