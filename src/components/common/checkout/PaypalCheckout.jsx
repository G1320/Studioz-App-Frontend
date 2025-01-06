import { useEffect, useState } from 'react';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { sendOrderConfirmation, sendPayoutNotification } from '@services/email-service';
import { useUserContext } from '@contexts/UserContext';
import { toast } from 'sonner';
import { processMarketplaceOrder } from '@services/order-service';
import { processSellerPayout } from '@services/payout-service';

function Message({ content }) {
  return <p>{content}</p>;
}

const PaypalCheckout = ({ cart, merchantId }) => {
  const { user } = useUserContext();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (merchantId) {
      dispatch({
        type: 'resetOptions',
        value: {
          ...options,
          merchantId: merchantId
        }
      });
    }
  }, [merchantId]);

  if (!cart?.items?.length) {
    return <Message content="Cart is empty or invalid." />;
  }

  const BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://studioz-backend.onrender.com/api'
      : 'http://localhost:3003/api';

  return (
    <div className="paypal-buttons-container">
      <PayPalButtons
        forceReRender={[merchantId]}
        style={{
          shape: 'rect',
          layout: 'vertical',
          color: 'gold',
          label: 'paypal'
        }}
        createOrder={async () => {
          try {
            const response = await fetch(`${BASE_URL}/PPorders/marketplace/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                cart: cart.items.map((item) => ({
                  name: item.name.en + ' at ' + item.studioName.en + ' - ' + item.bookingDate,
                  id: item.itemId,
                  quantity: item.hours || item.quantity || 1,
                  price: item.price
                })),
                merchantId: merchantId
              })
            });

            const orderData = await response.json();

            if (orderData.id) {
              return orderData.id;
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(`${BASE_URL}/PPorders/${data.orderID}/capture`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            const orderData = await response.json();
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart();
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');

              // const response = await processMarketplaceOrder(user.email, orderData, merchantId);

              const state = {
                orderData: {
                  ...orderData,
                  purchase_units: orderData.purchase_units
                }
              };

              await Promise.all([
                sendOrderConfirmation(user?.email || orderData.payer.email_address, state.orderData),
                processSellerPayout(merchantId, orderData.purchase_units[0].amount.value, orderData.id),
                sendPayoutNotification(merchantId, orderData.purchase_units[0].amount.value, orderData.id)
              ]);

              toast.success('Order confirmation email sent');

              navigate(`/order-success/${orderData.id}`, { state: state });
            }
          } catch (error) {
            console.error(error);
            setMessage(`Sorry, your transaction could not be processed...${error}`);
          }
        }}
      />
      <Message content={message} />
    </div>
  );
};

export default PaypalCheckout;
