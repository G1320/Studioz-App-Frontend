import { User } from 'src/types/index';

export const getAccessToken = async () => {
  const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
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
    const response = await fetch('https://api.sandbox.paypal.com/v2/customer/partner-referrals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        partner_merchant_id: partnerId,
        payer_email_address: payer.email
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
