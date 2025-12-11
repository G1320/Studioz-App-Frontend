import { Item } from 'src/types';
import { calculateDistance } from '@shared/utils/distanceUtils';

interface FilterItemsOptions {
  category?: string;
  subCategory?: string;
  city?: string | null;
  userLocation?: { latitude: number; longitude: number } | null;
  maxDistance?: number; // in kilometers, optional (kept for parity with studios)
}

export const filterItems = (
  items: Item[] = [],
  { category, subCategory, city, userLocation, maxDistance }: FilterItemsOptions
): Item[] => {
  let filtered = items.filter((item) => {
    const matchesCategory = (() => {
      // If no category filter, show all items
      if (!category || category.trim() === '') return true;

      // If subcategory is specified, filter by subcategory
      if (subCategory && subCategory.trim() !== '') {
        return item?.subCategories?.includes(subCategory) ?? false;
      }

      // If only category is specified, fall back to category list
      return item?.categories?.includes(category);
    })();

    const matchesCity = city && city.trim() !== '' ? item?.city === city : true;

    return matchesCategory && matchesCity;
  });

  // If user location is provided, sort by proximity and optionally filter by max distance
  if (userLocation) {
    filtered = filtered
      .map((item) => {
        if (item.lat && item.lng) {
          const distance = calculateDistance(userLocation.latitude, userLocation.longitude, item.lat, item.lng);
          return { item, distance };
        }
        return { item, distance: Infinity };
      })
      .filter((entry) => {
        if (maxDistance !== undefined) {
          return entry.distance <= maxDistance;
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance)
      .map((entry) => entry.item);
  }

  return filtered;
};
