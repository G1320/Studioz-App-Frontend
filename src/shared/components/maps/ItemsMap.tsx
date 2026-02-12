import './styles/_index.scss';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Item } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { useStudiosMap, useGeolocateHandlers } from './hooks/useStudiosMap';

interface ItemMapProps {
  items: Item[];
  selectedCity?: string | null;
  userLocation?: { latitude: number; longitude: number } | null;
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const ItemsMap: React.FC<ItemMapProps> = ({ items = [], selectedCity, userLocation }) => {
  const [popupInfo, setPopupInfo] = useState<Item | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const langNavigate = useLanguageNavigate();
  const { i18n } = useTranslation();

  // Get the current language (default to 'en' if not 'he')
  const currentLang = i18n.language === 'he' ? 'he' : 'en';

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

  const handleNavigateToItem = (studioId: string) => {
    langNavigate(`/studio/${studioId}`);
  };

  const handleMarkerClick = (item: Item) => {
    setPopupInfo(item);
    updateViewState({
      latitude: item.lat! + 0.06,
      longitude: item.lng!,
      zoom: 10
    });
  };

  return (
    <div className="map items-map" style={{ height: '500px', width: '100%', position: 'relative' }}>
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

        {items.map((item) => {
          if (item.lat && item.lng) {
            return (
              <Marker
                key={item._id}
                latitude={item.lat}
                longitude={item.lng}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(item);
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
                src={popupInfo.studioImgUrl}
                onClick={() => handleNavigateToItem(popupInfo.studioId)}
                alt={popupInfo.name[currentLang] || popupInfo.name.en}
              />
              <div className="popup-content">
                <h3 className="popup-title">{popupInfo.name[currentLang] || popupInfo.name.en}</h3>
                <h2 className="popup-description">{popupInfo.studioName[currentLang] || popupInfo.studioName.en}</h2>
                <p className="popup-city">{popupInfo.address}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
