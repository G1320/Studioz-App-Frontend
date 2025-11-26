import { Studio } from 'src/types';

interface FilterStudiosOptions {
  category?: string;
  subcategory?: string;
  city?: string | null;
}

export const filterStudios = (
  studios: Studio[] = [],
  { category, subcategory, city }: FilterStudiosOptions
): Studio[] => {
  return studios.filter((studio) => {
    const matchesCategory = (() => {
      if (!category) return true;

      if (!subcategory) {
        return studio?.categories?.includes(category);
      }

      return studio?.subCategories?.includes(subcategory);
    })();

    const matchesCity = city ? studio?.city === city : true;

    return matchesCategory && matchesCity;
  });
};
