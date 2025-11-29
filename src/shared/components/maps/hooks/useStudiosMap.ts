import { useState, useEffect, useRef } from 'react';
import { MapRef } from 'react-map-gl';
import { cities } from '@core/config/cities/cities';

interface UseStudiosMapOptions {
  selectedCity?: string | null;
  userLocation?: { latitude: number; longitude: number } | null;
  isMapLoaded: boolean;
  mapRef: React.RefObject<MapRef>;
}

export interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
}

const DEFAULT_VIEW_STATE: ViewState = {
  latitude: 32.0561,
  longitude: 34.7516,
  zoom: 9,
  bearing: -5
};

/**
 * Custom hook to manage StudiosMap viewState and flyTo logic
 */
export const useStudiosMap = ({
  selectedCity,
  userLocation,
  isMapLoaded,
  mapRef
}: UseStudiosMapOptions) => {
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const previousUserLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

  // Pan to selected city
  useEffect(() => {
    if (selectedCity && isMapLoaded && mapRef.current) {
      const city = cities.find((c) => c.name === selectedCity);
      if (city) {
        mapRef.current.flyTo({
          center: [city.lng, city.lat],
          zoom: city.zoom || 11,
          duration: 1500
        });
      }
    }
  }, [selectedCity, isMapLoaded, mapRef]);

  // Pan to user location when it becomes available (from popup)
  // Only fly if userLocation is newly set (changed from null/undefined to a value)
  useEffect(() => {
    const isNewLocation =
      userLocation &&
      (!previousUserLocationRef.current ||
        previousUserLocationRef.current.latitude !== userLocation.latitude ||
        previousUserLocationRef.current.longitude !== userLocation.longitude);

    if (isNewLocation && isMapLoaded && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 12, // Good zoom level for user location
        duration: 1500
      });
    }

    // Update ref to track previous location
    previousUserLocationRef.current = userLocation || null;
  }, [userLocation, isMapLoaded, mapRef]);

  const handleViewStateChange = (newViewState: any) => {
    setViewState({
      latitude: newViewState.latitude,
      longitude: newViewState.longitude,
      zoom: newViewState.zoom,
      bearing: newViewState.bearing ?? DEFAULT_VIEW_STATE.bearing
    });
  };

  const updateViewState = (updates: Partial<ViewState>) => {
    setViewState((prev) => ({ ...prev, ...updates }));
  };

  return {
    viewState,
    setViewState: handleViewStateChange,
    updateViewState
  };
};

/**
 * Handlers for GeolocateControl events
 */
export const useGeolocateHandlers = (updateViewState: (updates: Partial<ViewState>) => void) => {
  const handleGeolocate = (e: any) => {
    if (e.coords) {
      updateViewState({
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
        zoom: 12
      });
    }
  };

  const handleGeolocateError = (e: any) => {
    // Log error but don't block - user can try again
    if (e.code === 3) {
      console.warn('Geolocation timeout - this may be due to slow GPS or network issues');
    } else if (e.code === 1) {
      console.warn('Geolocation permission denied');
    } else {
      console.warn('Geolocation error:', e.message);
    }
  };

  return {
    handleGeolocate,
    handleGeolocateError
  };
};

