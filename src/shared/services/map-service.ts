import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { cities, type CityConfig } from '@core/config/cities/cities';
import { calculateDistance } from '@shared/utils/distanceUtils';

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

/**
 * Get the city name from latitude and longitude coordinates
 * Uses reverse geocoding first, then falls back to finding the closest city
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns City name string or null if not found
 */
export const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    // Try reverse geocoding first
    const response = await geocodingClient
      .reverseGeocode({
        query: [longitude, latitude],
        limit: 1,
        types: ['place', 'locality']
      })
      .send();

    const match = response.body.features[0];
    if (match) {
      // Extract city name from the response
      const cityName = match.text || match.place_name?.split(',')[0];
      if (cityName) {
        // Check if the city exists in our cities config
        const normalizedCityName = cityName.trim();
        const city = cities.find(
          (c) =>
            c.name.toLowerCase() === normalizedCityName.toLowerCase() ||
            c.displayName?.toLowerCase() === normalizedCityName.toLowerCase()
        );
        if (city) {
          return city.name;
        }
      }
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
  }

  // Fallback: find the closest city by distance
  return getClosestCity(latitude, longitude);
};

/**
 * Find the closest city to given coordinates by calculating distances
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns City name string or null if no cities available
 */
export const getClosestCity = (latitude: number, longitude: number): string | null => {
  if (cities.length === 0) {
    return null;
  }

  let closestCity: CityConfig | null = null;
  let minDistance = Infinity;

  for (const city of cities) {
    const distance = calculateDistance(latitude, longitude, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  return closestCity?.name || null;
};
