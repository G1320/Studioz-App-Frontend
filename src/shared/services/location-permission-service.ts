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

// User Location Storage (using localStorage)
const LOCATION_STORAGE_KEY = 'userLocation';

export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

/**
 * Save user location coordinates
 */
export const saveUserLocation = (latitude: number, longitude: number): void => {
  const location: UserLocation = {
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save user location:', error);
  }
};

/**
 * Get stored user location
 */
export const getUserLocation = (): UserLocation | null => {
  try {
    const locationData = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!locationData) return null;

    return JSON.parse(locationData) as UserLocation;
  } catch (error) {
    console.error('Failed to get user location:', error);
    return null;
  }
};

/**
 * Check if stored location is stale (older than specified minutes)
 * @param maxAgeMinutes - Maximum age in minutes before location is considered stale (default: 60)
 * @returns true if location is stale or doesn't exist, false otherwise
 */
export const isLocationStale = (maxAgeMinutes: number = 60): boolean => {
  const location = getUserLocation();
  if (!location || !location.timestamp) {
    return true;
  }

  try {
    const locationTime = new Date(location.timestamp).getTime();
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;
    
    return (now - locationTime) > maxAgeMs;
  } catch (error) {
    console.error('Failed to check location staleness:', error);
    return true;
  }
};

/**
 * Clear stored user location
 */
export const clearUserLocation = (): void => {
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user location:', error);
  }
};

