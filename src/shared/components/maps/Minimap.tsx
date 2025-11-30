import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MinimapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  markerColor?: string;
}

const mapBoxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export const Minimap: React.FC<MinimapProps> = ({
  latitude,
  longitude,
  zoom = 14,
  width = '100%',
  height = '300px',
  className = '',
  markerColor = 'var(--color-brand)'
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom
  });

  return (
    <div className={`minimap ${className}`} style={{ width, height, position: 'relative' }}>
      {!isMapLoaded && (
        <div className="map-loader">
          <div className="map-loader__spinner"></div>
        </div>
      )}
      <Map
        {...viewState}
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapBoxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={() => setIsMapLoaded(true)}
        interactive={true}
        scrollZoom={true}
        doubleClickZoom={true}
        dragRotate={false}
      >
        <Marker latitude={latitude} longitude={longitude} anchor="center">
          <div
            style={{
              backgroundColor: markerColor,
              border: '3px solid white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
            aria-label="Location marker"
          />
        </Marker>
      </Map>
    </div>
  );
};
