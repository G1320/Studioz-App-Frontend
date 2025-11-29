import React, { useState, useEffect, useRef } from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  ScaleControl,
  MapRef
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Studio } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { cities } from '@core/config/cities/cities';

interface StudioMapProps {
  studios: Studio[];
  selectedCity?: string | null;
  userLocation?: { latitude: number; longitude: number } | null;
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const StudiosMap: React.FC<StudioMapProps> = ({ studios, selectedCity, userLocation }) => {
  const [popupInfo, setPopupInfo] = useState<Studio | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const previousUserLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

  const [viewState, setViewState] = useState({
    latitude: 32.0561,
    longitude: 34.7516,
    zoom: 9,
    bearing: -5
  });

  const langNavigate = useLanguageNavigate();

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
  }, [selectedCity, isMapLoaded]);

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
  }, [userLocation, isMapLoaded]);

  const handleMapClick = () => {
    if (popupInfo) {
      setPopupInfo(null);
    }
  };

  const handleNavigateToStudio = (studioId: string) => {
    langNavigate(`/studio/${studioId}`);
  };

  const handleMarkerClick = (studio: Studio) => {
    setPopupInfo(studio);
    setViewState((prev) => ({
      ...prev,
      latitude: studio.lat! + 0.06,
      longitude: studio.lng!,
      zoom: 10,
      angle: 200
    }));
  };

  // Handle geolocate events to ensure control works
  const handleGeolocate = (e: any) => {
    if (e.coords) {
      setViewState((prev) => ({
        ...prev,
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
        zoom: 12
      }));
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

  return (
    <div
      className="map studios-map"
      style={{ height: '500px', width: '100%', position: 'relative' }}
      key="map-container"
    >
      {!isMapLoaded && (
        <div className="map-loader">
          <div className="map-loader__spinner"></div>
        </div>
      )}
      <Map
        ref={mapRef}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapBoxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        onLoad={() => {
          setIsMapLoaded(true);
          // Debug: Check if GeolocateControl is accessible
          if (mapRef.current) {
            const mapInstance = (mapRef.current as any).getMap?.() || (mapRef.current as any)._map;
            if (mapInstance) {
              console.log('Map loaded, checking controls...');
              const controls = (mapInstance as any)._controls || [];
              console.log('Controls found:', controls.length);
              const geolocateControl = controls.find((c: any) => c.constructor.name === 'GeolocateControl');
              console.log('GeolocateControl found:', !!geolocateControl);
            }
          }
        }}
      >
        <GeolocateControl
          key="geolocate-control"
          position="top-left"
          onGeolocate={handleGeolocate}
          onError={handleGeolocateError}
          showUserHeading={false}
          trackUserLocation={false}
          positionOptions={{
            enableHighAccuracy: false, // Use less accurate but faster location
            timeout: 20000, // 20 seconds timeout (increased from default)
            maximumAge: 60000 // Accept cached location up to 1 minute old
          }}
        />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {studios.map((studio) => {
          if (studio.lat && studio.lng) {
            return (
              <Marker
                key={studio._id}
                latitude={studio.lat}
                longitude={studio.lng}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(studio);
                }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'var(--color-brand)',
                    border: '2px solid white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              </Marker>
            );
          }
          return null;
        })}

        {popupInfo && (
          <Popup
            latitude={popupInfo.lat!}
            longitude={popupInfo.lng!}
            anchor="bottom"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            offset={20}
          >
            <div className="map-popup">
              <img
                src={popupInfo.coverImage}
                onClick={() => handleNavigateToStudio(popupInfo._id)}
                alt={popupInfo.name.en}
              />
              <div className="popup-content">
                <h3 className="popup-title">{popupInfo.name.en}</h3>
                {/* <p className="popup-description">{popupInfo.description}</p> */}
                <p className="popup-city">{popupInfo.address}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
