import { useState, useCallback } from 'react';
import { canUseGeolocation } from '@shared/utils/botDetection';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  getCurrentPosition: () => Promise<GeolocationPosition | null>;
}

export interface GeolocationPositionError {
  code: number;
  message: string;
}

/**
 * Hook to get user's current geolocation
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      // Skip geolocation API calls for bots/crawlers (prevents errors during Google crawling)
      if (!canUseGeolocation()) {
        const error: GeolocationPositionError = {
          code: 0,
          message: 'Geolocation is not available'
        };
        setError(error);
        setIsLoading(false);
        resolve(null);
        return;
      }

      if (!navigator.geolocation) {
        const error: GeolocationPositionError = {
          code: 0,
          message: 'Geolocation is not supported by your browser'
        };
        setError(error);
        setIsLoading(false);
        resolve(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        (success) => {
          const pos: GeolocationPosition = {
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            accuracy: success.coords.accuracy || undefined
          };
          setPosition(pos);
          setError(null);
          setIsLoading(false);
          resolve(pos);
        },
        (failure) => {
          const error: GeolocationPositionError = {
            code: failure.code,
            message:
              failure.code === 1
                ? 'Location permission denied'
                : failure.code === 2
                  ? 'Location unavailable'
                  : 'Location request timed out'
          };
          setError(error);
          setPosition(null);
          setIsLoading(false);
          resolve(null);
        },
        options
      );
    });
  }, []);

  return {
    position,
    error,
    isLoading,
    getCurrentPosition
  };
};

