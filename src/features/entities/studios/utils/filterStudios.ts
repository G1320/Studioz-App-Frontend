import { Studio } from 'src/types';
import { calculateDistance } from '@shared/utils/distanceUtils';

interface FilterStudiosOptions {
  category?: string;
  subcategory?: string;
  city?: string | null;
  userLocation?: { latitude: number; longitude: number } | null;
  maxDistance?: number; // in kilometers, optional
}

export const filterStudios = (
  studios: Studio[] = [],
  { category, subcategory, city, userLocation, maxDistance }: FilterStudiosOptions
): Studio[] => {
  let filtered = studios.filter((studio) => {
    // Filter by subcategory if specified (works independently of category)
    const matchesSubcategory = (() => {
      if (subcategory && subcategory.trim() !== '') {
        return studio?.subCategories?.includes(subcategory) ?? false;
      }
      // If category is specified but no subcategory, show all studios with subcategories
      if (category && category.trim() !== '') {
        return studio?.subCategories && studio.subCategories.length > 0;
      }
      // No filter, show all
      return true;
    })();

    // Filter by city if specified
    const matchesCity = city && city.trim() !== '' ? studio?.city === city : true;

    return matchesSubcategory && matchesCity;
  });

  // If user location is provided, sort by proximity and optionally filter by max distance
  if (userLocation) {
    filtered = filtered
      .map((studio) => {
        if (studio.lat && studio.lng) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            studio.lat,
            studio.lng
          );
          return { studio, distance };
        }
        return { studio, distance: Infinity };
      })
      .filter((item) => {
        // Filter by max distance if provided
        if (maxDistance !== undefined) {
          return item.distance <= maxDistance;
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.studio);
  }

  return filtered;
};
