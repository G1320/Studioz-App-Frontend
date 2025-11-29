import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  hasBeenAsked,
  hasGranted,
  savePermission,
  getUserLocation,
  saveUserLocation as saveUserLocationToStorage
} from '@shared/services/location-permission-service';

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

export const LocationPermissionProvider: React.FC<LocationPermissionProviderProps> = ({ children }) => {
  const [hasBeenAskedState, setHasBeenAskedState] = useState(false);
  const [hasGrantedState, setHasGrantedState] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userLocation, setUserLocationState] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
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
  }, []);

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
