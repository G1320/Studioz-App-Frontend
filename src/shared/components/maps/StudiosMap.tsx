import React, { useState, useRef } from 'react';
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
import { useStudiosMap, useGeolocateHandlers } from './hooks/useStudiosMap';

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
  const langNavigate = useLanguageNavigate();

  // Use custom hook for map viewState and flyTo logic
  const { viewState, setViewState, updateViewState } = useStudiosMap({
    selectedCity,
    userLocation,
    isMapLoaded,
    mapRef
  });

  // Use custom hook for geolocate handlers
  const { handleGeolocate, handleGeolocateError } = useGeolocateHandlers(updateViewState);

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
    updateViewState({
      latitude: studio.lat! + 0.06,
      longitude: studio.lng!,
      zoom: 10
    });
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
        onLoad={() => setIsMapLoaded(true)}
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
