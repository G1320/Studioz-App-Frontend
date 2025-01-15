// const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
const isProduction = false;

export const PAYPAL_CLIENT_ID = isProduction
  ? import.meta.env.VITE_PAYPAL_LIVE_CLIENT_ID
  : import.meta.env.VITE_PAYPAL_SUBSCRIPTION_SANDBOX_CLIENT_ID;
const currency = isProduction ? 'ILS' : 'USD';

export const initialOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: currency,
  components: 'buttons'
};
