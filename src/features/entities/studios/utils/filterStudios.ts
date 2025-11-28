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
    const matchesCategory = (() => {
      // If no category filter, show all studios
      if (!category || category.trim() === '') return true;

      // If subcategory is specified, filter by subcategory
      if (subcategory && subcategory.trim() !== '') {
        return studio?.subCategories?.includes(subcategory) ?? false;
      }

      // If only category is specified (e.g., /studios/music),
      // show all studios that have subcategories (since all subcategories are under music)
      // This assumes all subcategories belong to the music category
      return studio?.subCategories && studio.subCategories.length > 0;
    })();

    const matchesCity = city && city.trim() !== '' ? studio?.city === city : true;

    return matchesCategory && matchesCity;
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
