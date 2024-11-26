import Studio from 'src/types/studio';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface mapProps {
  studios?: Studio[];
}

const googleMap: React.FC<mapProps> = ({ studios }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap center={{ lat: 32.0853, lng: 34.7818 }} zoom={10}>
      {studios?.map((studio: Studio) => (
        <Marker
          key={studio._id}
          position={{ lat: studio.location.coordinates[1], lng: studio.location.coordinates[0] }}
        />
      ))}
    </GoogleMap>
  );
};

export default googleMap;
