export const filterBySubcategory = <T extends { category?: string; subCategory?: string }>(
  data: T[],
  subCategory: string
): T[] => {
  return data.filter((item) => item.subCategory?.toLowerCase() === subCategory.toLowerCase());
};
