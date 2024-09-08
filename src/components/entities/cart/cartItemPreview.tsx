import React from 'react';
import Button from '../../common/buttons/genericButton';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../../types/index';

interface CartItemPreviewProps {
  item: Item;
  quantity: number;
  onRemoveFromCart: (item: Item) => void;
}

const CartItemPreview: React.FC<CartItemPreviewProps> = ({ item, quantity, onRemoveFromCart }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName !== 'BUTTON') {
      navigate(`/item/${item?._id}`);
    }
  };

  return (
    <article onClick={handleClick} className="preview cart-preview">
      <h3 onClick={handleClick}>{item?.name}</h3>
      <p>{item?.studioName}</p>
      <div>
        <small onClick={handleClick}>${item?.price?.toFixed(2)}</small>
        <small onClick={handleClick}>Qty: {quantity}</small>
      </div>
      <Button onClick={() => onRemoveFromCart(item)} className="remove-from-cart">
        Remove
      </Button>
    </article>
  );
};

export default CartItemPreview;
