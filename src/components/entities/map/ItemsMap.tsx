import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Item } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';

interface ItemMapProps {
  items: Item[];
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const ItemsMap: React.FC<ItemMapProps> = ({ items = [] }) => {
  const [popupInfo, setPopupInfo] = useState<Item | null>(null);
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

  const handleNavigateToItem = (studioId: string) => {
    langNavigate(`/studio/${studioId}`);
  };

  const handleMarkerClick = (item: Item) => {
    setPopupInfo(item);
    setViewState((prev) => ({
      ...prev,
      latitude: item.lat! + 0.07,
      longitude: item.lng!,
      zoom: 10,
      angle: 200
    }));
  };

  return (
    <div className="map items-map" style={{ height: '500px', width: '100%' }}>
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
                src={popupInfo.studioImgUrl}
                onClick={() => handleNavigateToItem(popupInfo.studioId)}
                alt={popupInfo.name.en}
              />
              <h3 className="popup-title">{popupInfo.name.en}</h3>
              <h2 className="popup-description">{popupInfo.studioName.en}</h2>
              <p className="popup-city">{popupInfo.address}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};
