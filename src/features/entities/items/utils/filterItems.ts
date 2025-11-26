import { Item } from 'src/types';

interface FilterItemsOptions {
  category?: string;
  subCategory?: string;
}

export const filterItems = (items: Item[] = [], { category, subCategory }: FilterItemsOptions): Item[] => {
  return items.filter((item) => {
    if (!category) return true;

    if (subCategory === undefined) {
      return item?.categories?.includes(category);
    }

    return item?.subCategories?.includes(subCategory);
  });
};

