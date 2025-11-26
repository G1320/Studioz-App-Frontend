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
};
