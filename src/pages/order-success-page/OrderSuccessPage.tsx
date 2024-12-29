import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderData = state?.orderData;

  if (!orderData) {
    return (
      <div className="order-success">
        <h1>Order Not Found</h1>
        <p>We couldn't find details for this order.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="order-success">
      <h1>🎉 Order Success! 🎉</h1>
      <p>Thank you for your purchase!</p>
      <div className="order-details">
        <h2>Order Details</h2>
        <p>
          <strong>Order ID:</strong> {orderData.id}
        </p>
        <p>
          <strong>Customer Name:</strong> {orderData.payer.name.given_name}
        </p>
        <p>
          <strong>Total Amount:</strong> ${orderData.purchase_units[0].payments.captures[0].amount.value}
        </p>
        <p>
          <strong>Order Date:</strong>{' '}
          {new Date(orderData.purchase_units[0].payments.captures[0].create_time).toLocaleDateString()}
        </p>
      </div>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default OrderSuccessPage;
