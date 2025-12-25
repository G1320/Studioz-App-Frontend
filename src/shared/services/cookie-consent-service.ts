import Cookies from 'js-cookie';

const COOKIE_NAME = 'cookieConsent';
const COOKIE_EXPIRY_DAYS = 365; // 12 months

export interface CookieConsent {
  accepted: boolean;
  timestamp: string;
}

/**
 * Check if user has given cookie consent
 */
export const hasConsent = (): boolean => {
  const consent = getConsent();
  return consent?.accepted === true;
};

/**
 * Get stored consent data
 */
export const getConsent = (): CookieConsent | null => {
  const consentCookie = Cookies.get(COOKIE_NAME);
  if (!consentCookie) return null;

  try {
    return JSON.parse(consentCookie) as CookieConsent;
  } catch {
    return null;
  }
};

/**
 * Save consent preference
 */
export const saveConsent = (accepted: boolean): void => {
  const consent: CookieConsent = {
    accepted,
    timestamp: new Date().toISOString()
  };

  Cookies.set(COOKIE_NAME, JSON.stringify(consent), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: 'lax',
    secure: import.meta.env.VITE_NODE_ENV === 'production'
  });
};

/**
 * Clear consent (for testing or withdrawal)
 */
export const clearConsent = (): void => {
  Cookies.remove(COOKIE_NAME);
};



