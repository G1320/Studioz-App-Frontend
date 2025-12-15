import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  hasBeenAsked,
  hasGranted,
  savePermission,
  getUserLocation,
  saveUserLocation as saveUserLocationToStorage,
  isLocationStale
} from '@shared/services/location-permission-service';
import { useGeolocation } from '@shared/hooks/utils/geolocation';
import { isBot } from '@shared/utils/botDetection';

interface LocationPermissionContextType {
  hasBeenAsked: boolean;
  hasGranted: boolean;
  showPrompt: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  grantPermission: () => void;
  denyPermission: () => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
}

interface LocationPermissionProviderProps {
  children: ReactNode;
}

const LocationPermissionContext = createContext<LocationPermissionContextType | undefined>(undefined);

// Location refresh interval in minutes (default: 60 minutes)
const LOCATION_REFRESH_INTERVAL_MINUTES = 60;

export const LocationPermissionProvider: React.FC<LocationPermissionProviderProps> = ({ children }) => {
  const [hasBeenAskedState, setHasBeenAskedState] = useState(false);
  const [hasGrantedState, setHasGrantedState] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userLocation, setUserLocationState] = useState<{ latitude: number; longitude: number } | null>(null);
  const { getCurrentPosition } = useGeolocation();

  useEffect(() => {
    // Skip location permission for bots/crawlers (prevents popup during Google crawling)
    if (isBot()) {
      setShowPrompt(false);
      setHasBeenAskedState(true); // Mark as "asked" so popup never shows
      return;
    }

    // Check permission on mount
    const asked = hasBeenAsked();
    const granted = hasGranted();
    setHasBeenAskedState(asked);
    setHasGrantedState(granted);
    // Only show prompt if user hasn't been asked yet
    setShowPrompt(!asked);

    // Load persisted user location
    const storedLocation = getUserLocation();
    if (storedLocation) {
      setUserLocationState({
        latitude: storedLocation.latitude,
        longitude: storedLocation.longitude
      });
    }

    // Refresh location if:
    // 1. Permission is granted AND
    // 2. (No stored location OR stored location is stale)
    if (granted && (!storedLocation || isLocationStale(LOCATION_REFRESH_INTERVAL_MINUTES))) {
      // Silently refresh location in the background
      getCurrentPosition()
        .then((position) => {
          if (position) {
            setUserLocation({
              latitude: position.latitude,
              longitude: position.longitude
            });
          }
        })
        .catch((error) => {
          // Silently fail - keep using stored location if available
          console.debug('Failed to refresh location:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const grantPermission = () => {
    savePermission(true);
    setHasGrantedState(true);
    setHasBeenAskedState(true);
    setShowPrompt(false);
  };

  const denyPermission = () => {
    savePermission(false);
    setHasGrantedState(false);
    setHasBeenAskedState(true);
    setShowPrompt(false);
  };

  const setUserLocation = (location: { latitude: number; longitude: number } | null) => {
    if (location) {
      // Save to storage
      saveUserLocationToStorage(location.latitude, location.longitude);
      setUserLocationState(location);
    } else {
      // Clear from storage
      setUserLocationState(null);
    }
  };

  return (
    <LocationPermissionContext.Provider
      value={{
        hasBeenAsked: hasBeenAskedState,
        hasGranted: hasGrantedState,
        showPrompt,
        userLocation,
        grantPermission,
        denyPermission,
        setUserLocation
      }}
    >
      {children}
    </LocationPermissionContext.Provider>
  );
};

export const useLocationPermission = (): LocationPermissionContextType => {
  const context = useContext(LocationPermissionContext);
  if (context === undefined) {
    throw new Error('useLocationPermission must be used within a LocationPermissionProvider');
  }
  return context;
};
