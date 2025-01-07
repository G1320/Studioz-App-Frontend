const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
const currency = isProduction ? 'ILS' : 'USD';

export const initialOptions = {
  clientId: isProduction ? import.meta.env.VITE_PAYPAL_LIVE_CLIENT_ID : import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID,
  currency: currency,
  components: 'buttons'
};
