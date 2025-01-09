import { User } from 'src/types/index';

// const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
const isProduction = false;

const PAYPAL_BASE_URL = isProduction
  ? import.meta.env.VITE_PAYPAL_LIVE_BASE_URL
  : import.meta.env.VITE_PAYPAL_SANDBOX_BASE_URL;

const PAYPAL_CLIENT_ID = isProduction
  ? import.meta.env.VITE_PAYPAL_LIVE_CLIENT_ID
  : import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID;

const PAYPAL_SECRET_KEY = isProduction
  ? import.meta.env.VITE_PAYPAL_LIVE_SECRET_KEY
  : import.meta.env.VITE_PAYPAL_SANDBOX_SECRET_KEY;

export const getAccessToken = async () => {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error: ${error.error_description || 'Unknown'}`);
  }
  const data = await response.json();
  return data.access_token;
};

export const createPartnerReferral = async (accessToken: string, payer: User, partnerId: string) => {
  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/customer/partner-referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        partner_merchant_id: partnerId,
        payer_email_address: payer.email,
        tracking_id: crypto.randomUUID()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error: ${error.name || 'Unknown'} - ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create partner referral:', error);
    throw error;
  }
};
