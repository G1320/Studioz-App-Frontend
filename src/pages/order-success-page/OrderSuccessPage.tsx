import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendOrderConfirmation } from '@services/email-service';
import { toast } from 'sonner';
import { useUserContext } from '@contexts/UserContext';

const OrderSuccessPage: React.FC = () => {
  const { state } = useLocation();
  const { user } = useUserContext();

  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL');
  };

  const orderData = state?.orderData;
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (orderData && !emailSent) {
        try {
          setEmailSent(true);

          const items = orderData.purchase_units[0].items.map((item: any) => ({
            name: item.name,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.unit_amount.value),
            total: parseFloat(item.unit_amount.value) * parseInt(item.quantity)
          }));

          const emailDetails = {
            id: orderData.id,
            items: items,
            total: parseFloat(orderData.purchase_units[0].amount.value),
            customerName: orderData.payer.name.given_name,
            orderDate: formatDate(orderData.create_time),
            paymentStatus: orderData.status
          };

          await sendOrderConfirmation(user?.email || orderData.payer.email_address, emailDetails);

          toast.success('Order confirmation email sent');
        } catch (error) {
          console.error('Failed to send order confirmation:', error);
        }
      }
    };

    sendConfirmationEmail();
  }, [orderData, emailSent]);

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
          <strong>Total Amount:</strong> ₪{orderData.purchase_units[0].amount.value}
        </p>
        <p>
          <strong>Order Date:</strong> {formatDate(orderData.create_time)}
        </p>
        <p>
          <strong>Email:</strong> {orderData.payer.email_address}
        </p>
      </div>
      <div className="button-group">
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
