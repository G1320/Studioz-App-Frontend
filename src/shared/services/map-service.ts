import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN });

export const getCoordinates = async (address: string) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1
      })
      .send();

    const match = response.body.features[0];
    if (match) {
      const {
        center: [longitude, latitude]
      } = match;
      return { latitude, longitude };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};
