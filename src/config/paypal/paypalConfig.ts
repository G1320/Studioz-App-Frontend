const currency = import.meta.env.VITE_NODE_ENV === 'production' ? 'ILS' : 'USD';

export const initialOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: currency,
  components: 'buttons'
};
