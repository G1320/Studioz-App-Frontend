import Cookies from 'js-cookie';

const COOKIE_NAME = 'locationPermission';
const COOKIE_EXPIRY_DAYS = 365; // 12 months

export interface LocationPermission {
  hasAsked: boolean;
  granted: boolean;
  timestamp: string;
}

/**
 * Check if user has been asked for location permission
 */
export const hasBeenAsked = (): boolean => {
  const permission = getPermission();
  return permission?.hasAsked === true;
};

/**
 * Check if user has granted location permission
 */
export const hasGranted = (): boolean => {
  const permission = getPermission();
  return permission?.granted === true;
};

/**
 * Get stored permission data
 */
export const getPermission = (): LocationPermission | null => {
  const permissionCookie = Cookies.get(COOKIE_NAME);
  if (!permissionCookie) return null;

  try {
    return JSON.parse(permissionCookie) as LocationPermission;
  } catch {
    return null;
  }
};

/**
 * Save permission preference
 */
export const savePermission = (granted: boolean): void => {
  const permission: LocationPermission = {
    hasAsked: true,
    granted,
    timestamp: new Date().toISOString()
  };

  Cookies.set(COOKIE_NAME, JSON.stringify(permission), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: 'lax',
    secure: import.meta.env.VITE_NODE_ENV === 'production'
  });
};

/**
 * Clear permission (for testing or reset)
 */
export const clearPermission = (): void => {
  Cookies.remove(COOKIE_NAME);
};

