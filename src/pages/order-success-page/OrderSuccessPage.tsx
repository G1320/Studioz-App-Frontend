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

  const orderData = state?.orderData;

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (orderData && !emailSent) {
        try {
          const emailDetails = {
            id: orderData.id,
            items: orderData.purchase_units[0].items || [],
            total: Number(orderData.purchase_units[0].payments.captures[0].amount.value),
            customerName: orderData.payer.name.given_name,
            orderDate: new Date(orderData.purchase_units[0].payments.captures[0].create_time).toLocaleDateString(),
            paymentStatus: orderData.status
          };

          await sendOrderConfirmation(user?.email || orderData.payer.email_address, emailDetails);
          setEmailSent(true);
          toast.success('Order confirmation email sent');
        } catch (error) {
          console.error('Failed to send order confirmation:', error);
          toast.error('Failed to send order confirmation email');
        }
      }
    };

    sendConfirmationEmail();
  }, []);

  if (!orderData) {
    return (
      <div className="order-success">
        <h1>Order Not Found</h1>
        <p>We couldn't find details for this order.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  const handleResendEmail = async () => {
    try {
      await sendOrderConfirmation(user?.email || orderData.payer.email_address, {
        id: orderData.id,
        items: orderData.purchase_units[0].items || [],
        total: Number(orderData.purchase_units[0].payments.captures[0].amount.value),
        customerName: orderData.payer.name.given_name,
        orderDate: new Date(orderData.purchase_units[0].payments.captures[0].create_time).toLocaleDateString(),
        paymentStatus: orderData.status
      });
      toast.success('Order confirmation email resent');
    } catch (error) {
      console.error('Failed to resend order confirmation:', error);
      toast.error('Failed to resend confirmation email');
    }
  };

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
        <p>
          <strong>Email:</strong> {orderData.payer.email_address}
        </p>
      </div>
      <div className="button-group">
        <button onClick={handleResendEmail}>Resend Confirmation Email</button>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
