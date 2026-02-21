import Cookies from 'js-cookie';

const COOKIE_NAME = 'cookieConsent';
const COOKIE_EXPIRY_DAYS = 365;
const CONSENT_VERSION = '1.0';
const AUDIT_LOG_KEY = 'consentAuditLog';

export interface CookieConsentCategories {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentData {
  categories: CookieConsentCategories;
  timestamp: string;
  version: string;
}

export interface ConsentAuditEntry {
  timestamp: string;
  action: 'granted_all' | 'rejected_non_essential' | 'custom' | 'withdrawn';
  categories: CookieConsentCategories;
  version: string;
  userAgent: string;
}

const DEFAULT_CATEGORIES: CookieConsentCategories = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false
};

const ALL_CATEGORIES: CookieConsentCategories = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: true
};

export const getDefaultCategories = (): CookieConsentCategories => ({ ...DEFAULT_CATEGORIES });
export const getAllCategories = (): CookieConsentCategories => ({ ...ALL_CATEGORIES });
export const getConsentVersion = (): string => CONSENT_VERSION;

/**
 * Check if user has made any consent decision (accepted or rejected)
 */
export const hasConsent = (): boolean => {
  return getConsent() !== null;
};

/**
 * Check if a specific category is consented
 */
export const hasCategory = (category: keyof CookieConsentCategories): boolean => {
  const consent = getConsent();
  if (!consent) return category === 'essential';
  return consent.categories[category] === true;
};

/**
 * Get stored consent data
 */
export const getConsent = (): CookieConsentData | null => {
  const consentCookie = Cookies.get(COOKIE_NAME);
  if (!consentCookie) return null;

  try {
    const parsed = JSON.parse(consentCookie);
    // Handle legacy format migration
    if ('accepted' in parsed && !('categories' in parsed)) {
      return {
        categories: parsed.accepted ? ALL_CATEGORIES : DEFAULT_CATEGORIES,
        timestamp: parsed.timestamp || new Date().toISOString(),
        version: CONSENT_VERSION
      };
    }
    return parsed as CookieConsentData;
  } catch {
    return null;
  }
};

/**
 * Check if stored consent needs re-consent due to policy version change
 */
export const needsReconsent = (): boolean => {
  const consent = getConsent();
  if (!consent) return false;
  return consent.version !== CONSENT_VERSION;
};

/**
 * Save consent preference with categories
 */
export const saveConsent = (categories: CookieConsentCategories): void => {
  const consent: CookieConsentData = {
    categories: { ...categories, essential: true },
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION
  };

  Cookies.set(COOKIE_NAME, JSON.stringify(consent), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: 'lax',
    secure: import.meta.env.VITE_NODE_ENV === 'production'
  });
};

/**
 * Clear consent (for withdrawal)
 */
export const clearConsent = (): void => {
  Cookies.remove(COOKIE_NAME);
};

/**
 * Log a consent event to localStorage audit trail
 */
export const logConsentEvent = (
  action: ConsentAuditEntry['action'],
  categories: CookieConsentCategories
): void => {
  const entry: ConsentAuditEntry = {
    timestamp: new Date().toISOString(),
    action,
    categories,
    version: CONSENT_VERSION,
    userAgent: navigator.userAgent
  };

  try {
    const log = getConsentAuditLog();
    log.push(entry);
    // Keep last 50 entries to avoid unbounded growth
    const trimmed = log.slice(-50);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may be unavailable
  }
};

/**
 * Get consent audit log from localStorage
 */
export const getConsentAuditLog = (): ConsentAuditEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConsentAuditEntry[];
  } catch {
    return [];
  }
};
