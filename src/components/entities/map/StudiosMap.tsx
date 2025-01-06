import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Studio } from 'src/types/index';
import { useLanguageNavigate } from '@hooks/utils';

interface StudioMapProps {
  studios: Studio[];
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const StudiosMap: React.FC<StudioMapProps> = ({ studios }) => {
  const [popupInfo, setPopupInfo] = useState<Studio | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 32.0561,
    longitude: 34.7516,
    zoom: 9,
    bearing: -5
  });

  const langNavigate = useLanguageNavigate();

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
    <div className="map studios-map" style={{ height: '500px', width: '100%' }} key="map-container">
      <Map
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapBoxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
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
                    backgroundColor: '#4A90E2',
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
              <h3 className="popup-title">{popupInfo.name.en}</h3>
              {/* <p className="popup-description">{popupInfo.description}</p> */}
              <p className="popup-city">{popupInfo.address}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
