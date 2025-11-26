import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, ScaleControl, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Studio } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import { cities } from '@core/config/cities/cities';

interface StudioMapProps {
  studios: Studio[];
  selectedCity?: string | null;
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const StudiosMap: React.FC<StudioMapProps> = ({ studios, selectedCity }) => {
  const [popupInfo, setPopupInfo] = useState<Studio | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);

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
          zoom: 11,
          duration: 1500
        });
      }
    }
  }, [selectedCity, isMapLoaded]);

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
        <GeolocateControl position="top-left" />
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
