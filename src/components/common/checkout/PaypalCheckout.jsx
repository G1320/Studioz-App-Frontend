import { useState } from 'react';

import { PayPalButtons } from '@paypal/react-paypal-js';

function Message({ content }) {
  return <p>{content}</p>;
}

const PaypalCheckout = ({ cart, merchantId }) => {
  const [message, setMessage] = useState('');

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
        style={{
          shape: 'rect',
          layout: 'vertical',
          color: 'gold',
          label: 'paypal'
        }}
        createOrder={async () => {
          try {
            const response = await fetch(`${BASE_URL}/orders/marketplace/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                cart: cart.items.map((item) => ({
                  name: item.name.en,
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
          console.log('onApprove data: ', data);
          try {
            const response = await fetch(`${BASE_URL}/orders/${data.orderID}/capture`, {
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
              const transaction = orderData.purchase_units[0].payments.captures[0];
              setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`);
              console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
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
