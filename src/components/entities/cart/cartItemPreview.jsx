import React from 'react';
import Button from '../../common/buttons/genericButton';
import { useNavigate } from 'react-router-dom';

const CartItemPreview = ({ item, quantity, onRemoveFromCart }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const target = e.target;
    if (target.nodeName !== 'BUTTON') {
      navigate(`/item/${item?._id}`);
    }
  };
  return (
    <article onClick={handleClick} className="preview cart-preview">
      <h3 onClick={handleClick}>{item?.name}</h3>
      <p>{item?.studioName}</p>
      <div>
        <small onClick={handleClick}>${item?.price}</small>
        <small onClick={handleClick}>Qty: {quantity}</small>
      </div>
      <Button onClick={() => onRemoveFromCart(item)} className="remove-from-cart">
        Remove
      </Button>
    </article>
  );
};

export default CartItemPreview;
